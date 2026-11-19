package store

import (
	"fmt"
	"time"

	"carbongero/pkg/chain"
	"carbongero/pkg/db"
)

const demoVerifier = "VERIFIER-DEMO"

// PendingProof is a proof awaiting human peer review.
type PendingProof struct {
	ProofID      string    `json:"proofId"`
	ActivityID   string    `json:"activityId"`
	ActivityType string    `json:"activityType"`
	EvidenceHash string    `json:"evidenceHash"`
	ImpactValue  float64   `json:"impactValue"`
	ImpactUnit   string    `json:"impactUnit"`
	MethodologyID string   `json:"methodologyId"`
	CreatedAt    time.Time `json:"createdAt"`
}

// ReviewResult reports the outcome of a peer-review decision.
type ReviewResult struct {
	ProofID     string `json:"proofId"`
	Decision    string `json:"decision"`
	Network     string `json:"network"`
	AttestTx    string `json:"attestTx"`
	ExplorerURL string `json:"explorerUrl"`
	Live        bool   `json:"live"`
}

// ListPendingReviews returns proofs awaiting human peer review (PRD §5.4).
func ListPendingReviews(limit int) ([]PendingProof, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	if limit <= 0 || limit > 200 {
		limit = 50
	}
	rows, err := conn.Query(
		`SELECT id, activity_id, activity_type, coalesce(evidence_hash,''), coalesce(impact_value,0),
		        coalesce(impact_unit,''), coalesce(methodology_id,''), created_at
		 FROM sustainability_proofs WHERE review_status='PENDING_REVIEW'
		 ORDER BY created_at ASC LIMIT $1`, limit)
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

// SubmitReview records a verifier's peer-review decision, anchors an on-chain
// attestation, and updates the proof's review gate. decision must be APPROVED or
// REJECTED. Only an APPROVED proof can later be issued as a carbon credit.
func SubmitReview(proofID, decision, notes string) (*ReviewResult, error) {
	if decision != "APPROVED" && decision != "REJECTED" {
		return nil, fmt.Errorf("decision must be APPROVED or REJECTED")
	}
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}

	// Guard: the proof must exist and still be pending.
	var cur string
	if err := conn.QueryRow(`SELECT review_status FROM sustainability_proofs WHERE id=$1`, proofID).Scan(&cur); err != nil {
		return nil, fmt.Errorf("proof not found")
	}
	if cur != "PENDING_REVIEW" {
		return nil, fmt.Errorf("proof already reviewed (%s)", cur)
	}

	network, tx, live := chain.Attest(proofID, demoVerifier, decision)

	id := fmt.Sprintf("REV-%d", time.Now().UnixNano())
	if _, err := conn.Exec(
		`INSERT INTO reviews (id,proof_id,verifier_id,decision,notes,attest_network,attest_tx)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		id, proofID, demoVerifier, decision, nullStr(notes), network, nullStr(tx),
	); err != nil {
		return nil, err
	}
	if _, err := conn.Exec(
		`UPDATE sustainability_proofs SET review_status=$1 WHERE id=$2`, decision, proofID,
	); err != nil {
		return nil, err
	}
	logTx(conn, tx, network, "ATTEST", proofID, demoVerifier, txLive(live))

	return &ReviewResult{
		ProofID: proofID, Decision: decision, Network: network, AttestTx: tx,
		ExplorerURL: chain.ExplorerURL(network, tx), Live: live,
	}, nil
}

// txLive maps a live flag to a blockchain_transactions status.
func txLive(live bool) string {
	if live {
		return "CONFIRMED"
	}
	return "SIMULATED"
}
