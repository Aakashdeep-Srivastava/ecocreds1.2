// Package store holds CarbonGero's business logic: the recycling → Proof of
// Sustainability flow (PRD §11 MVP), carbon accounting, and proof persistence.
package store

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"math"
	"time"

	"carbongero/pkg/carbon"
	"carbongero/pkg/chain"
	"carbongero/pkg/db"
)

const demoUser = "USR-DEMO"

// Activity is a submitted sustainability activity.
type Activity struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	Category    string    `json:"category"`
	Description string    `json:"description"`
	Quantity    float64   `json:"quantity"`
	Unit        string    `json:"unit"`
	Location    string    `json:"location"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
}

// AIAssessment is the (stubbed) automated evidence assessment.
type AIAssessment struct {
	Classification    string  `json:"classification"`
	Confidence        float64 `json:"confidence"`
	RecommendedAction string  `json:"recommendedAction"`
	ModelVersion      string  `json:"modelVersion"`
}

// Proof is a Proof of Sustainability record (PRD §5.6).
type Proof struct {
	ID                 string    `json:"id"`
	ActivityID         string    `json:"activityId"`
	UserID             string    `json:"userId"`
	ActivityType       string    `json:"activityType"`
	EvidenceHash       string    `json:"evidenceHash"`
	VerificationStatus string    `json:"verificationStatus"`
	ImpactValue        float64   `json:"impactValue"`
	ImpactUnit         string    `json:"impactUnit"`
	ImpactStatus       string    `json:"impactStatus"`
	MethodologyID      string    `json:"methodologyId"`
	BlockchainStatus   string    `json:"blockchainStatus"`
	BlockchainNetwork  string    `json:"blockchainNetwork"`
	BlockchainTx       string    `json:"blockchainTx"`
	ExplorerURL        string    `json:"explorerUrl"`
	CreatedAt          time.Time `json:"createdAt"`
}

// SubmitInput is the payload for the end-to-end MVP flow.
type SubmitInput struct {
	Category    string  `json:"category"`
	Description string  `json:"description"`
	Quantity    float64 `json:"quantity"`
	Unit        string  `json:"unit"`
	Location    string  `json:"location"`
	Evidence    string  `json:"evidence"` // text/base64 of the proof; hashed server-side
}

// Reward is a voluntary CarbonGero reward-ASA grant for a verified proof
// (PRD §6.2.A). It is NOT a certified carbon credit.
type Reward struct {
	ID          string    `json:"id"`
	ProofID     string    `json:"proofId"`
	Amount      int64     `json:"amount"`
	Unit        string    `json:"unit"`
	Status      string    `json:"status"`
	Network     string    `json:"network"`
	TxID        string    `json:"txId"`
	ASAID       uint64    `json:"asaId"`
	ExplorerURL string    `json:"explorerUrl"`
	CreatedAt   time.Time `json:"createdAt"`
}

// SubmitResult bundles everything produced by the flow.
type SubmitResult struct {
	Activity Activity          `json:"activity"`
	AI       AIAssessment      `json:"ai"`
	Impact   carbon.Assessment `json:"impact"`
	Proof    Proof             `json:"proof"`
	Reward   *Reward           `json:"reward"`
}

// HealthCheck pings the database.
func HealthCheck() error {
	conn, err := db.Conn()
	if err != nil {
		return err
	}
	return conn.Ping()
}

// Heartbeat records a keep-alive ping with minimal compute (one tiny upsert).
// Used by the scheduled cron to keep the Neon project active during slow
// onboarding without forcing it to stay warm 24/7.
func Heartbeat() (lastPing time.Time, count int64, err error) {
	conn, err := db.Conn()
	if err != nil {
		return time.Time{}, 0, err
	}
	err = conn.QueryRow(
		`INSERT INTO heartbeats (id, last_ping, ping_count) VALUES ('singleton', now(), 1)
		 ON CONFLICT (id) DO UPDATE SET last_ping = now(), ping_count = heartbeats.ping_count + 1
		 RETURNING last_ping, ping_count`,
	).Scan(&lastPing, &count)
	return lastPing, count, err
}

// assessEvidence is a deterministic AI stub. Real FastAPI microservices
// (image/waste classification, duplicate & anomaly detection) are PRD Phase 2.
func assessEvidence(category, evidenceHash string) AIAssessment {
	// Confidence derived from the hash so it is stable but non-uniform.
	var seed int
	for i := 0; i < len(evidenceHash) && i < 8; i++ {
		seed += int(evidenceHash[i])
	}
	conf := 0.82 + float64(seed%12)/100.0 // 0.82–0.93
	return AIAssessment{
		Classification:    category + "_EVIDENCE",
		Confidence:        conf,
		RecommendedAction: "APPROVED_FOR_REVIEW",
		ModelVersion:      "stub-0.1",
	}
}

// Submit runs the full flow: activity → evidence hash → AI stub → carbon
// accounting → Proof of Sustainability → Algorand anchor, atomically.
func Submit(in SubmitInput) (*SubmitResult, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if in.Category == "" {
		in.Category = "RECYCLING"
	}
	if in.Unit == "" {
		in.Unit = "kg"
	}
	if in.Quantity <= 0 {
		return nil, fmt.Errorf("quantity must be greater than zero")
	}
	// Input bounds (reliability / sanity).
	if in.Quantity > 100000 {
		return nil, fmt.Errorf("quantity exceeds the allowed maximum")
	}
	if len(in.Description) > 2000 {
		in.Description = in.Description[:2000]
	}

	// Anti-fraud: per-user daily submission cap.
	var todayCount int
	_ = conn.QueryRow(
		`SELECT count(*) FROM activities WHERE user_id=$1 AND created_at::date = now()::date`, demoUser,
	).Scan(&todayCount)
	if todayCount >= 25 {
		return nil, fmt.Errorf("daily submission limit reached; please try again tomorrow")
	}

	// Evidence hash (SHA-256) — PRD §5.3 FR-018.
	raw := in.Evidence
	if raw == "" {
		raw = fmt.Sprintf("%s:%.3f:%s:%d", in.Category, in.Quantity, in.Unit, time.Now().UnixNano())
	}
	sum := sha256.Sum256([]byte(raw))
	evidenceHash := hex.EncodeToString(sum[:])

	// Anti-fraud: reject duplicate evidence (PRD §5.3 FR-020). Skipped for the
	// auto-generated placeholder hash (no real evidence attached).
	if in.Evidence != "" {
		var dupe int
		_ = conn.QueryRow(`SELECT count(*) FROM evidence WHERE file_hash=$1`, evidenceHash).Scan(&dupe)
		if dupe > 0 {
			return nil, fmt.Errorf("this evidence has already been submitted (duplicate detected)")
		}
	}

	// Look up methodology for the category.
	var methID, mUnit string
	var ef, of float64
	err = conn.QueryRow(
		`SELECT id, emission_factor, oxidation_factor, unit FROM methodologies WHERE activity_type=$1 ORDER BY created_at LIMIT 1`,
		in.Category,
	).Scan(&methID, &ef, &of, &mUnit)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("no methodology for category %q", in.Category)
	}
	if err != nil {
		return nil, err
	}

	impact := carbon.Calculate(in.Quantity, ef, of, "kgCO2e")
	ai := assessEvidence(in.Category, evidenceHash)

	tx, err := conn.Begin()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	now := time.Now()
	actID := fmt.Sprintf("ACT-%d", now.UnixNano())
	act := Activity{
		ID: actID, UserID: demoUser, Category: in.Category, Description: in.Description,
		Quantity: in.Quantity, Unit: in.Unit, Location: in.Location, Status: "VERIFIED", CreatedAt: now,
	}
	if _, err = tx.Exec(
		`INSERT INTO activities (id,user_id,category,description,quantity,unit,location,status,created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
		act.ID, act.UserID, act.Category, act.Description, act.Quantity, act.Unit, act.Location, act.Status, now,
	); err != nil {
		return nil, err
	}

	evID := fmt.Sprintf("EV-%d", now.UnixNano())
	if _, err = tx.Exec(
		`INSERT INTO evidence (id,activity_id,file_name,file_hash,mime_type) VALUES ($1,$2,$3,$4,$5)`,
		evID, actID, "evidence", evidenceHash, "text/plain",
	); err != nil {
		return nil, err
	}

	aiID := fmt.Sprintf("AI-%d", now.UnixNano())
	if _, err = tx.Exec(
		`INSERT INTO ai_assessments (id,activity_id,classification,confidence,recommended_action,model_version)
		 VALUES ($1,$2,$3,$4,$5,$6)`,
		aiID, actID, ai.Classification, ai.Confidence, ai.RecommendedAction, ai.ModelVersion,
	); err != nil {
		return nil, err
	}

	impID := fmt.Sprintf("IMP-%d", now.UnixNano())
	if _, err = tx.Exec(
		`INSERT INTO impact_assessments (id,activity_id,baseline_emissions,project_emissions,net_reduction,unit,methodology_id)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		impID, actID, impact.Baseline, impact.Project, impact.Net, impact.Unit, methID,
	); err != nil {
		return nil, err
	}

	var seq int
	if err = tx.QueryRow(`SELECT nextval('proof_seq')`).Scan(&seq); err != nil {
		return nil, err
	}
	proofID := fmt.Sprintf("POS-%d-%06d", now.Year(), seq)
	network, txid, live := chain.Anchor(proofID, evidenceHash)
	bcStatus := "SIMULATED"
	if live {
		bcStatus = "ANCHORED"
	}

	proof := Proof{
		ID: proofID, ActivityID: actID, UserID: demoUser, ActivityType: in.Category,
		EvidenceHash: evidenceHash, VerificationStatus: "VERIFIED",
		ImpactValue: impact.Net, ImpactUnit: impact.Unit, ImpactStatus: "ESTIMATED",
		MethodologyID: methID, BlockchainStatus: bcStatus, BlockchainNetwork: network,
		BlockchainTx: txid, ExplorerURL: chain.ExplorerURL(network, txid), CreatedAt: now,
	}
	if _, err = tx.Exec(
		`INSERT INTO sustainability_proofs
		 (id,activity_id,user_id,activity_type,evidence_hash,verification_status,impact_value,impact_unit,impact_status,methodology_id,blockchain_status,blockchain_network,blockchain_tx,created_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
		proof.ID, proof.ActivityID, proof.UserID, proof.ActivityType, proof.EvidenceHash,
		proof.VerificationStatus, proof.ImpactValue, proof.ImpactUnit, proof.ImpactStatus,
		proof.MethodologyID, proof.BlockchainStatus, proof.BlockchainNetwork, proof.BlockchainTx, now,
	); err != nil {
		return nil, err
	}

	if err = tx.Commit(); err != nil {
		return nil, err
	}

	// Post-commit on-chain side effects (kept out of the DB transaction so a
	// slow node never holds the serverless pool open). Best-effort: a failed
	// reward issuance or tx-log write never fails an already-committed proof.
	anchorStatus := "SIMULATED"
	if live {
		anchorStatus = "CONFIRMED"
	}
	logTx(conn, txid, network, "ANCHOR", proof.ID, "", anchorStatus)

	reward := issueReward(conn, proof.ID, impact.Net)
	return &SubmitResult{Activity: act, AI: ai, Impact: impact, Proof: proof, Reward: reward}, nil
}

// issueReward grants reward-ASA units for a verified proof (1 CGRO per kgCO2e,
// minimum 1), persists the issuance, and logs the transfer. Config-gated with a
// simulated fallback inside chain.IssueReward — see pkg/chain/asa.go.
func issueReward(conn *sql.DB, proofID string, netImpact float64) *Reward {
	amount := int64(math.Round(netImpact))
	if amount < 1 {
		amount = 1
	}
	addr, _ := GetWallet() // demo user's linked Algorand address (may be empty)
	res := chain.IssueReward(addr, uint64(amount))

	id := fmt.Sprintf("RWD-%d", time.Now().UnixNano())
	_, _ = conn.Exec(
		`INSERT INTO reward_issuances (id,proof_id,user_id,wallet_address,asa_id,amount,status,network,tx_id)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (proof_id) DO NOTHING`,
		id, proofID, demoUser, nullStr(addr), int64(res.ASAID), amount, res.Status, res.Network, nullStr(res.TxID),
	)
	if res.TxID != "" {
		st := "SIMULATED"
		if res.Status == chain.RewardIssued {
			st = "CONFIRMED"
		}
		logTx(conn, res.TxID, res.Network, "ASA_TRANSFER", id, addr, st)
	}
	return &Reward{
		ID: id, ProofID: proofID, Amount: amount, Unit: chain.RewardUnitName,
		Status: res.Status, Network: res.Network, TxID: res.TxID, ASAID: res.ASAID,
		ExplorerURL: chain.ExplorerURL(res.Network, res.TxID), CreatedAt: time.Now(),
	}
}

// logTx appends to the generic on-chain transaction log (best-effort).
func logTx(conn *sql.DB, txID, network, kind, refID, addr, status string) {
	if txID == "" {
		return
	}
	id := fmt.Sprintf("BTX-%d", time.Now().UnixNano())
	_, _ = conn.Exec(
		`INSERT INTO blockchain_transactions (id,tx_id,network,kind,ref_id,address,status)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		id, txID, network, kind, refID, nullStr(addr), status,
	)
}

// nullStr maps "" to SQL NULL so optional text columns stay null, not empty.
func nullStr(s string) any {
	if s == "" {
		return nil
	}
	return s
}

// ListProofs returns recent proofs.
func ListProofs(limit int) ([]Proof, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	rows, err := conn.Query(
		`SELECT id,activity_id,user_id,activity_type,evidence_hash,verification_status,
		        impact_value,impact_unit,impact_status,methodology_id,blockchain_status,
		        blockchain_network,blockchain_tx,created_at
		 FROM sustainability_proofs ORDER BY created_at DESC LIMIT $1`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []Proof{}
	for rows.Next() {
		var p Proof
		if err := rows.Scan(&p.ID, &p.ActivityID, &p.UserID, &p.ActivityType, &p.EvidenceHash,
			&p.VerificationStatus, &p.ImpactValue, &p.ImpactUnit, &p.ImpactStatus, &p.MethodologyID,
			&p.BlockchainStatus, &p.BlockchainNetwork, &p.BlockchainTx, &p.CreatedAt); err != nil {
			return nil, err
		}
		p.ExplorerURL = chain.ExplorerURL(p.BlockchainNetwork, p.BlockchainTx)
		out = append(out, p)
	}
	return out, rows.Err()
}

// Stats summarises the registry for dashboards.
type Stats struct {
	TotalProofs   int     `json:"totalProofs"`
	TotalActivities int   `json:"totalActivities"`
	TotalOffsetKg float64 `json:"totalOffsetKg"`
	Anchored      int     `json:"anchored"`
}

// WalletUser is the identity returned by the Pera wallet login flow.
type WalletUser struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Role    string `json:"role"`
	Address string `json:"address"`
}

// SetWallet associates an Algorand address with the demo user (PRD FR-006).
func SetWallet(address string) error {
	_, err := LinkWallet(address)
	return err
}

// LinkWallet associates the address with the demo user and returns the
// resulting identity — the backend half of the Pera wallet login flow.
func LinkWallet(address string) (*WalletUser, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if _, err = conn.Exec(`UPDATE users SET wallet_address=$1 WHERE id=$2`, address, demoUser); err != nil {
		return nil, err
	}
	u := &WalletUser{Address: address}
	var name, role sql.NullString
	if err = conn.QueryRow(
		`SELECT id,email,name,role FROM users WHERE id=$1`, demoUser,
	).Scan(&u.ID, &u.Email, &name, &role); err != nil {
		return nil, err
	}
	u.Name, u.Role = name.String, role.String
	return u, nil
}

// GetWallet returns the demo user's associated Algorand address (may be empty).
func GetWallet() (string, error) {
	conn, err := db.Conn()
	if err != nil {
		return "", err
	}
	var addr sql.NullString
	if err := conn.QueryRow(`SELECT wallet_address FROM users WHERE id=$1`, demoUser).Scan(&addr); err != nil {
		return "", err
	}
	return addr.String, nil
}

// GetStats aggregates registry figures.
func GetStats() (*Stats, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	s := &Stats{}
	_ = conn.QueryRow(`SELECT count(*) FROM sustainability_proofs`).Scan(&s.TotalProofs)
	_ = conn.QueryRow(`SELECT count(*) FROM activities`).Scan(&s.TotalActivities)
	_ = conn.QueryRow(`SELECT coalesce(sum(impact_value),0) FROM sustainability_proofs`).Scan(&s.TotalOffsetKg)
	_ = conn.QueryRow(`SELECT count(*) FROM sustainability_proofs WHERE blockchain_status='ANCHORED'`).Scan(&s.Anchored)
	return s, nil
}

// RewardSummary aggregates a user's reward-token position (PRD §6.2.A).
type RewardSummary struct {
	Unit          string `json:"unit"`
	ASAID         uint64 `json:"asaId"`
	AssetExplorer string `json:"assetExplorer"`
	Live           bool  `json:"live"`           // real on-chain issuance enabled
	EarnedCoins    int64 `json:"earnedCoins"`    // sum of all issuances (platform ledger)
	ClaimableCoins int64 `json:"claimableCoins"` // accrued but not yet settled to a wallet
	Issued         int   `json:"issued"`         // on-chain confirmed issuances
	Simulated      int   `json:"simulated"`      // simulated issuances
	OptInRequired  int   `json:"optInRequired"`  // awaiting wallet opt-in
	PendingWallet  int   `json:"pendingWallet"`  // no wallet linked yet
}

// claimableStatuses are reward rows that are accrued but not yet settled to the
// user's Algorand wallet (the freemium balance waiting to be claimed).
const claimableStatuses = "('PENDING_WALLET','OPTIN_REQUIRED','FAILED')"

// RewardAsset describes the CarbonGero reward ASA so clients know what to opt
// into (PRD §6.2.A — a voluntary reward, not a carbon credit).
type RewardAsset struct {
	ASAID    uint64 `json:"asaId"`
	Unit     string `json:"unit"`
	Name     string `json:"name"`
	Decimals int    `json:"decimals"`
	Live     bool   `json:"live"`
	Explorer string `json:"explorer"`
}

// RewardAssetInfo returns the reward-ASA descriptor.
func RewardAssetInfo() RewardAsset {
	id := chain.RewardASAID()
	return RewardAsset{
		ASAID: id, Unit: chain.RewardUnitName, Name: chain.RewardAssetName,
		Decimals: 0, Live: chain.RewardLive(), Explorer: chain.ExplorerAssetURL(id),
	}
}

// GetRewardSummary aggregates the demo user's reward issuances.
func GetRewardSummary() (*RewardSummary, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	s := &RewardSummary{Unit: chain.RewardUnitName, ASAID: chain.RewardASAID(), Live: chain.RewardLive()}
	s.AssetExplorer = chain.ExplorerAssetURL(s.ASAID)
	_ = conn.QueryRow(`SELECT coalesce(sum(amount),0) FROM reward_issuances WHERE user_id=$1`, demoUser).Scan(&s.EarnedCoins)
	_ = conn.QueryRow(`SELECT coalesce(sum(amount),0) FROM reward_issuances WHERE user_id=$1 AND status IN `+claimableStatuses, demoUser).Scan(&s.ClaimableCoins)
	_ = conn.QueryRow(`SELECT count(*) FROM reward_issuances WHERE user_id=$1 AND status=$2`, demoUser, chain.RewardIssued).Scan(&s.Issued)
	_ = conn.QueryRow(`SELECT count(*) FROM reward_issuances WHERE user_id=$1 AND status=$2`, demoUser, chain.RewardSimulated).Scan(&s.Simulated)
	_ = conn.QueryRow(`SELECT count(*) FROM reward_issuances WHERE user_id=$1 AND status=$2`, demoUser, chain.RewardOptInReq).Scan(&s.OptInRequired)
	_ = conn.QueryRow(`SELECT count(*) FROM reward_issuances WHERE user_id=$1 AND status=$2`, demoUser, chain.RewardPending).Scan(&s.PendingWallet)
	return s, nil
}

// ListRewards returns recent reward issuances for the demo user.
func ListRewards(limit int) ([]Reward, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	rows, err := conn.Query(
		`SELECT id, proof_id, amount, status, network, coalesce(tx_id,''), asa_id, created_at
		 FROM reward_issuances WHERE user_id=$1 ORDER BY created_at DESC LIMIT $2`, demoUser, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []Reward{}
	for rows.Next() {
		var r Reward
		var asa int64
		if err := rows.Scan(&r.ID, &r.ProofID, &r.Amount, &r.Status, &r.Network, &r.TxID, &asa, &r.CreatedAt); err != nil {
			return nil, err
		}
		r.ASAID = uint64(asa)
		r.Unit = chain.RewardUnitName
		r.ExplorerURL = chain.ExplorerURL(r.Network, r.TxID)
		out = append(out, r)
	}
	return out, rows.Err()
}

// AccountSnapshot reports a wallet's live on-chain reward position via the
// Algorand indexer (the "asset indexer" of PRD §6.1).
type AccountSnapshot struct {
	Address        string          `json:"address"`
	Explorer       string          `json:"explorer"`
	RewardASAID    uint64          `json:"rewardAsaId"`
	RewardUnit     string          `json:"rewardUnit"`
	RewardBalance  uint64          `json:"rewardBalance"`
	OptedIn        bool            `json:"optedIn"`
	Holdings       []chain.Holding `json:"holdings"`
	IndexerError   string          `json:"indexerError,omitempty"`
}

// GetAccountSnapshot queries the indexer for a wallet's ASA holdings. When no
// address is given it falls back to the demo user's linked wallet.
func GetAccountSnapshot(address string) (*AccountSnapshot, error) {
	if address == "" {
		address, _ = GetWallet()
	}
	snap := &AccountSnapshot{
		Address: address, Explorer: chain.ExplorerAccountURL(address),
		RewardASAID: chain.RewardASAID(), RewardUnit: chain.RewardUnitName,
	}
	if address == "" {
		return snap, nil
	}
	holdings, err := chain.AccountAssets(address)
	if err != nil {
		// Account may simply not exist on-chain yet (never funded) — report it
		// softly rather than failing the request.
		snap.IndexerError = err.Error()
		return snap, nil
	}
	snap.Holdings = holdings
	for _, h := range holdings {
		if snap.RewardASAID != 0 && h.ASAID == snap.RewardASAID {
			snap.OptedIn = true
			snap.RewardBalance = h.Amount
		}
	}
	return snap, nil
}

// ClaimResult reports the outcome of claiming accrued rewards to a wallet.
type ClaimResult struct {
	Claimed     int64  `json:"claimed"`
	Status      string `json:"status"` // ISSUED | SIMULATED | OPTIN_REQUIRED | NOTHING | FAILED
	Network     string `json:"network"`
	TxID        string `json:"txId"`
	ExplorerURL string `json:"explorerUrl"`
	ASAID       uint64 `json:"asaId"`
}

// ClaimRewards settles the user's accrued (freemium) reward balance to their
// Algorand wallet. This is the gate of the freemium model: credits accumulate
// off-chain while anonymous, and are moved on-chain only once the user connects
// a wallet and claims. One on-chain transfer settles the whole accrued balance.
func ClaimRewards(address string) (*ClaimResult, error) {
	if address == "" {
		return nil, fmt.Errorf("wallet address required to claim")
	}
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	// Linking the wallet means future issuances target it directly.
	if _, err = LinkWallet(address); err != nil {
		return nil, err
	}

	var total int64
	_ = conn.QueryRow(
		`SELECT coalesce(sum(amount),0) FROM reward_issuances WHERE user_id=$1 AND status IN `+claimableStatuses,
		demoUser,
	).Scan(&total)
	if total <= 0 {
		return &ClaimResult{Status: "NOTHING", ASAID: chain.RewardASAID()}, nil
	}

	res := chain.IssueReward(address, uint64(total))
	switch res.Status {
	case chain.RewardOptInReq:
		// Nothing settled — the wallet must opt into the ASA first.
		return &ClaimResult{Status: chain.RewardOptInReq, ASAID: res.ASAID}, nil
	case chain.RewardIssued, chain.RewardSimulated:
		_, _ = conn.Exec(
			`UPDATE reward_issuances SET status=$1, tx_id=$2, wallet_address=$3, network=$4, asa_id=$5
			 WHERE user_id=$6 AND status IN `+claimableStatuses,
			res.Status, nullStr(res.TxID), address, res.Network, int64(res.ASAID), demoUser,
		)
		logTx(conn, res.TxID, res.Network, "ASA_TRANSFER", "claim", address, txStatusOf(res.Status))
		recordTransfer(conn, res.ASAID, "", address, uint64(total), res.TxID, res.Network)
		return &ClaimResult{
			Claimed: total, Status: res.Status, Network: res.Network, TxID: res.TxID,
			ExplorerURL: chain.ExplorerURL(res.Network, res.TxID), ASAID: res.ASAID,
		}, nil
	default:
		return &ClaimResult{Status: chain.RewardFailed, ASAID: res.ASAID}, nil
	}
}

// recordTransfer appends an asset ownership-change record (PRD FR-033/FR-035).
func recordTransfer(conn *sql.DB, asaID uint64, from, to string, amount uint64, txID, network string) {
	if txID == "" {
		return
	}
	id := fmt.Sprintf("XFER-%d", time.Now().UnixNano())
	_, _ = conn.Exec(
		`INSERT INTO asset_transfers (id,asa_id,from_address,to_address,amount,tx_id,network)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		id, int64(asaID), nullStr(from), nullStr(to), int64(amount), txID, network,
	)
}

// txStatusOf maps a reward status to a blockchain_transactions status.
func txStatusOf(rewardStatus string) string {
	if rewardStatus == chain.RewardIssued {
		return "CONFIRMED"
	}
	return "SIMULATED"
}
