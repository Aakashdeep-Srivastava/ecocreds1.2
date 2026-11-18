// Package store holds CarbonGero's business logic: the recycling → Proof of
// Sustainability flow (PRD §11 MVP), carbon accounting, and proof persistence.
package store

import (
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
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

// SubmitResult bundles everything produced by the flow.
type SubmitResult struct {
	Activity Activity     `json:"activity"`
	AI       AIAssessment `json:"ai"`
	Impact   carbon.Assessment `json:"impact"`
	Proof    Proof        `json:"proof"`
}

// HealthCheck pings the database.
func HealthCheck() error {
	conn, err := db.Conn()
	if err != nil {
		return err
	}
	return conn.Ping()
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

	// Evidence hash (SHA-256) — PRD §5.3 FR-018.
	raw := in.Evidence
	if raw == "" {
		raw = fmt.Sprintf("%s:%.3f:%s:%d", in.Category, in.Quantity, in.Unit, time.Now().UnixNano())
	}
	sum := sha256.Sum256([]byte(raw))
	evidenceHash := hex.EncodeToString(sum[:])

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
	network, txid := chain.Anchor(proofID, evidenceHash)

	proof := Proof{
		ID: proofID, ActivityID: actID, UserID: demoUser, ActivityType: in.Category,
		EvidenceHash: evidenceHash, VerificationStatus: "VERIFIED",
		ImpactValue: impact.Net, ImpactUnit: impact.Unit, ImpactStatus: "ESTIMATED",
		MethodologyID: methID, BlockchainStatus: "ANCHORED", BlockchainNetwork: network,
		BlockchainTx: txid, ExplorerURL: chain.ExplorerURL(txid), CreatedAt: now,
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
	return &SubmitResult{Activity: act, AI: ai, Impact: impact, Proof: proof}, nil
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
		p.ExplorerURL = chain.ExplorerURL(p.BlockchainTx)
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
