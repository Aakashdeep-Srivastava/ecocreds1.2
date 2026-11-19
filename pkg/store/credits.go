package store

import (
	"database/sql"
	"fmt"
	"time"

	"carbongero/pkg/chain"
	"carbongero/pkg/db"
)

// CarbonCredit is a voluntary-market carbon-credit certificate issued from an
// APPROVED Proof of Sustainability (PRD §6.2.B). It is NOT a registry-accredited
// credit — the `registry` field and UI labeling keep that honest.
type CarbonCredit struct {
	ID            string     `json:"id"`
	ProofID       string     `json:"proofId"`
	Serial        string     `json:"serial"`
	OwnerUser     string     `json:"ownerUser"`
	OwnerAddress  string     `json:"ownerAddress"`
	ProjectID     string     `json:"projectId"`
	Registry      string     `json:"registry"`
	MethodologyID string     `json:"methodologyId"`
	Vintage       int        `json:"vintage"`
	Quantity      float64    `json:"quantity"`
	Unit          string     `json:"unit"`
	Status        string     `json:"status"`
	PriceUSDC     *float64   `json:"priceUsdc"`
	ASAID         uint64     `json:"asaId"`
	AnchorNetwork string     `json:"anchorNetwork"`
	AnchorTx      string     `json:"anchorTx"`
	ExplorerURL   string     `json:"explorerUrl"`
	CreatedAt     time.Time  `json:"createdAt"`
	RetiredAt     *time.Time `json:"retiredAt"`
}

// CreditEvent is one provenance/ownership event for a credit.
type CreditEvent struct {
	Kind         string    `json:"kind"`
	Actor        string    `json:"actor"`
	Counterparty string    `json:"counterparty"`
	PriceUSDC    *float64  `json:"priceUsdc"`
	Network      string    `json:"network"`
	Tx           string    `json:"tx"`
	ExplorerURL  string    `json:"explorerUrl"`
	CreatedAt    time.Time `json:"createdAt"`
}

// IssueCredit mints a carbon-credit certificate from an APPROVED proof. One
// credit per proof (anti-double-issuance, PRD §6.2 / FR-026).
func IssueCredit(proofID string) (*CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}

	var reviewStatus, activityType, evidenceHash, methID, impactUnit string
	var impactValue float64
	var created time.Time
	err = conn.QueryRow(
		`SELECT review_status, activity_type, coalesce(evidence_hash,''), coalesce(methodology_id,''),
		        coalesce(impact_value,0), coalesce(impact_unit,'kgCO2e'), created_at
		 FROM sustainability_proofs WHERE id=$1`, proofID,
	).Scan(&reviewStatus, &activityType, &evidenceHash, &methID, &impactValue, &impactUnit, &created)
	if err == sql.ErrNoRows {
		return nil, fmt.Errorf("proof not found")
	}
	if err != nil {
		return nil, err
	}
	if reviewStatus != "APPROVED" {
		return nil, fmt.Errorf("proof must be human-APPROVED before a credit can be issued (current: %s)", reviewStatus)
	}

	var existing string
	if err := conn.QueryRow(`SELECT id FROM carbon_credits WHERE proof_id=$1`, proofID).Scan(&existing); err == nil {
		return nil, fmt.Errorf("credit %s already issued for this proof", existing)
	}

	var seq int
	if err := conn.QueryRow(`SELECT nextval('credit_seq')`).Scan(&seq); err != nil {
		return nil, err
	}
	now := time.Now()
	creditID := fmt.Sprintf("CC-%d-%06d", now.Year(), seq)
	serial := fmt.Sprintf("CG-VCU-%d-%06d", now.Year(), seq)
	projectID := "PRJ-" + activityType
	addr, _ := GetWallet()

	network, tx, _ := chain.AnchorCertificate(creditID, serial, evidenceHash)

	if _, err := conn.Exec(
		`INSERT INTO carbon_credits
		 (id,proof_id,serial,owner_user,owner_address,project_id,methodology_id,vintage,quantity,unit,status,anchor_network,anchor_tx)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'ISSUED',$11,$12)`,
		creditID, proofID, serial, demoUser, nullStr(addr), projectID, nullStr(methID),
		now.Year(), impactValue, impactUnit, network, nullStr(tx),
	); err != nil {
		return nil, err
	}
	addCreditEvent(conn, creditID, "ISSUE", demoUser, "", nil, network, tx)
	logTx(conn, tx, network, "CREDIT_ANCHOR", creditID, addr, txLive(network == "algorand-testnet"))

	return GetCreditByID(creditID)
}

// SetListing lists (or re-prices) a credit on the exchange.
func SetListing(creditID string, priceUSDC float64) (*CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if priceUSDC <= 0 {
		return nil, fmt.Errorf("price must be greater than zero")
	}
	var status string
	if err := conn.QueryRow(`SELECT status FROM carbon_credits WHERE id=$1`, creditID).Scan(&status); err != nil {
		return nil, fmt.Errorf("credit not found")
	}
	if status == "RETIRED" || status == "SOLD" {
		return nil, fmt.Errorf("a %s credit cannot be listed", status)
	}
	if _, err := conn.Exec(
		`UPDATE carbon_credits SET status='LISTED', price_usdc=$1, listed_at=now() WHERE id=$2`,
		priceUSDC, creditID,
	); err != nil {
		return nil, err
	}
	addCreditEvent(conn, creditID, "LIST", demoUser, "", &priceUSDC, "off-exchange", "")
	return GetCreditByID(creditID)
}

// BuyCredit transfers a LISTED credit to a corporate buyer. The payment leg
// settles OFF-platform (USDC via a licensed ramp — see the off-ramp research);
// this records the ownership transfer + provenance on-chain.
func BuyCredit(creditID, buyer, buyerAddress string) (*CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if buyer == "" {
		buyer = "CORP-BUYER"
	}
	var status string
	var price sql.NullFloat64
	if err := conn.QueryRow(`SELECT status, price_usdc FROM carbon_credits WHERE id=$1`, creditID).Scan(&status, &price); err != nil {
		return nil, fmt.Errorf("credit not found")
	}
	if status != "LISTED" {
		return nil, fmt.Errorf("only a LISTED credit can be bought (current: %s)", status)
	}

	network, tx, _ := chain.AnchorCreditEvent(creditID, "credit-sale", buyer)
	if _, err := conn.Exec(
		`UPDATE carbon_credits SET status='SOLD', owner_user=$1, owner_address=$2 WHERE id=$3`,
		buyer, nullStr(buyerAddress), creditID,
	); err != nil {
		return nil, err
	}
	var p *float64
	if price.Valid {
		p = &price.Float64
	}
	addCreditEvent(conn, creditID, "SALE", demoUser, buyer, p, network, tx)
	recordTransfer(conn, 0, demoUser, buyer, 0, tx, network)
	logTx(conn, tx, network, "CREDIT_SALE", creditID, buyerAddress, txLive(network == "algorand-testnet"))
	return GetCreditByID(creditID)
}

// RetireCredit permanently retires a credit (claims the offset). A transfer does
// NOT establish an offset claim — retirement is the explicit claim (PRD §7).
func RetireCredit(creditID string) (*CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	var status string
	if err := conn.QueryRow(`SELECT status FROM carbon_credits WHERE id=$1`, creditID).Scan(&status); err != nil {
		return nil, fmt.Errorf("credit not found")
	}
	if status == "RETIRED" {
		return nil, fmt.Errorf("credit already retired")
	}
	network, tx, _ := chain.AnchorCreditEvent(creditID, "credit-retire", creditID)
	if _, err := conn.Exec(
		`UPDATE carbon_credits SET status='RETIRED', retired_at=now() WHERE id=$1`, creditID,
	); err != nil {
		return nil, err
	}
	addCreditEvent(conn, creditID, "RETIRE", demoUser, "", nil, network, tx)
	logTx(conn, tx, network, "CREDIT_RETIRE", creditID, "", txLive(network == "algorand-testnet"))
	return GetCreditByID(creditID)
}

// ListCredits returns credits by scope: "marketplace" (LISTED only), "mine"
// (owned by the demo user), or "" / "all" (everything).
func ListCredits(scope string, limit int) ([]CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if limit <= 0 || limit > 200 {
		limit = 100
	}
	where, args := "", []any{}
	switch scope {
	case "marketplace":
		where = "WHERE status='LISTED'"
	case "mine":
		where = "WHERE owner_user=$1"
		args = append(args, demoUser)
	}
	q := `SELECT id,proof_id,serial,owner_user,coalesce(owner_address,''),coalesce(project_id,''),registry,
	             coalesce(methodology_id,''),coalesce(vintage,0),quantity,unit,status,price_usdc,asa_id,
	             anchor_network,coalesce(anchor_tx,''),created_at,retired_at
	      FROM carbon_credits ` + where + ` ORDER BY created_at DESC LIMIT ` + fmt.Sprint(limit)
	rows, err := conn.Query(q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []CarbonCredit{}
	for rows.Next() {
		c, err := scanCredit(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *c)
	}
	return out, rows.Err()
}

// GetCreditByID returns a single credit (no events).
func GetCreditByID(id string) (*CarbonCredit, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	row := conn.QueryRow(
		`SELECT id,proof_id,serial,owner_user,coalesce(owner_address,''),coalesce(project_id,''),registry,
		        coalesce(methodology_id,''),coalesce(vintage,0),quantity,unit,status,price_usdc,asa_id,
		        anchor_network,coalesce(anchor_tx,''),created_at,retired_at
		 FROM carbon_credits WHERE id=$1`, id)
	return scanCredit(row)
}

// GetCreditEvents returns a credit's provenance trail (newest first).
func GetCreditEvents(creditID string) ([]CreditEvent, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	rows, err := conn.Query(
		`SELECT kind, coalesce(actor,''), coalesce(counterparty,''), price_usdc, network, coalesce(tx,''), created_at
		 FROM credit_events WHERE credit_id=$1 ORDER BY created_at DESC`, creditID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []CreditEvent{}
	for rows.Next() {
		var e CreditEvent
		var price sql.NullFloat64
		if err := rows.Scan(&e.Kind, &e.Actor, &e.Counterparty, &price, &e.Network, &e.Tx, &e.CreatedAt); err != nil {
			return nil, err
		}
		if price.Valid {
			e.PriceUSDC = &price.Float64
		}
		e.ExplorerURL = chain.ExplorerURL(e.Network, e.Tx)
		out = append(out, e)
	}
	return out, rows.Err()
}

// CreditSummary aggregates the credit registry for dashboards.
type CreditSummary struct {
	Issued   int     `json:"issued"`
	Listed   int     `json:"listed"`
	Sold     int     `json:"sold"`
	Retired  int     `json:"retired"`
	TotalKg  float64 `json:"totalKg"`
	Issuable int     `json:"issuable"` // APPROVED proofs without a credit yet
}

// GetCreditSummary returns registry counts + how many APPROVED proofs can still
// be issued as credits.
func GetCreditSummary() (*CreditSummary, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	s := &CreditSummary{}
	_ = conn.QueryRow(`SELECT count(*) FROM carbon_credits WHERE status='ISSUED'`).Scan(&s.Issued)
	_ = conn.QueryRow(`SELECT count(*) FROM carbon_credits WHERE status='LISTED'`).Scan(&s.Listed)
	_ = conn.QueryRow(`SELECT count(*) FROM carbon_credits WHERE status='SOLD'`).Scan(&s.Sold)
	_ = conn.QueryRow(`SELECT count(*) FROM carbon_credits WHERE status='RETIRED'`).Scan(&s.Retired)
	_ = conn.QueryRow(`SELECT coalesce(sum(quantity),0) FROM carbon_credits`).Scan(&s.TotalKg)
	_ = conn.QueryRow(
		`SELECT count(*) FROM sustainability_proofs p
		 WHERE p.review_status='APPROVED' AND NOT EXISTS (SELECT 1 FROM carbon_credits c WHERE c.proof_id=p.id)`,
	).Scan(&s.Issuable)
	return s, nil
}

// ListIssuableProofs returns APPROVED proofs that have not been issued as credits.
func ListIssuableProofs(limit int) ([]PendingProof, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	rows, err := conn.Query(
		`SELECT p.id, p.activity_id, p.activity_type, coalesce(p.evidence_hash,''), coalesce(p.impact_value,0),
		        coalesce(p.impact_unit,''), coalesce(p.methodology_id,''), p.created_at
		 FROM sustainability_proofs p
		 WHERE p.review_status='APPROVED' AND NOT EXISTS (SELECT 1 FROM carbon_credits c WHERE c.proof_id=p.id)
		 ORDER BY p.created_at DESC LIMIT $1`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := []PendingProof{}
	for rows.Next() {
		var p PendingProof
		if err := rows.Scan(&p.ProofID, &p.ActivityID, &p.ActivityType, &p.EvidenceHash,
			&p.ImpactValue, &p.ImpactUnit, &p.MethodologyID, &p.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	return out, rows.Err()
}

// --- helpers ---

type rowScanner interface {
	Scan(dest ...any) error
}

func scanCredit(r rowScanner) (*CarbonCredit, error) {
	var c CarbonCredit
	var price sql.NullFloat64
	var asa int64
	var retired sql.NullTime
	if err := r.Scan(&c.ID, &c.ProofID, &c.Serial, &c.OwnerUser, &c.OwnerAddress, &c.ProjectID, &c.Registry,
		&c.MethodologyID, &c.Vintage, &c.Quantity, &c.Unit, &c.Status, &price, &asa,
		&c.AnchorNetwork, &c.AnchorTx, &c.CreatedAt, &retired); err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("credit not found")
		}
		return nil, err
	}
	if price.Valid {
		c.PriceUSDC = &price.Float64
	}
	if retired.Valid {
		c.RetiredAt = &retired.Time
	}
	c.ASAID = uint64(asa)
	c.ExplorerURL = chain.ExplorerURL(c.AnchorNetwork, c.AnchorTx)
	return &c, nil
}

func addCreditEvent(conn *sql.DB, creditID, kind, actor, counterparty string, price *float64, network, tx string) {
	id := fmt.Sprintf("CEV-%d", time.Now().UnixNano())
	var p any
	if price != nil {
		p = *price
	}
	_, _ = conn.Exec(
		`INSERT INTO credit_events (id,credit_id,kind,actor,counterparty,price_usdc,network,tx)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
		id, creditID, kind, nullStr(actor), nullStr(counterparty), p, network, nullStr(tx),
	)
}
