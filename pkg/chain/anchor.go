// Package chain anchors Proof-of-Sustainability records to Algorand.
//
// When ALGORAND_MNEMONIC is set (a funded TestNet account), Anchor submits a
// real note-field transaction to Algorand TestNet and returns the on-chain tx.
// Otherwise it falls back to a deterministic SIMULATED anchor so the flow stays
// demonstrable. The result's "live" flag (and the "simulated" network label)
// tells the UI which mode produced the record — never present a simulated
// anchor as an on-chain-verified transaction.
package chain

import (
	"crypto/sha512"
	"encoding/base32"
	"strings"
)

// Anchor records a proof on-chain (real) or produces a simulated anchor.
// Returns the network label, the transaction id, and whether it is live.
func Anchor(proofID, evidenceHash string) (network, txID string, live bool) {
	if configured() {
		if tx, err := realAnchor(proofID, evidenceHash); err == nil {
			return "algorand-testnet", tx, true
		}
		// Graceful degradation: fall through to the simulated anchor on any
		// error (unfunded account, node timeout, etc.).
	}
	return "simulated", mockTx(proofID, evidenceHash), false
}

// mockTx derives a deterministic Algorand-style 52-char base32 id.
func mockTx(proofID, evidenceHash string) string {
	sum := sha512.Sum512_256([]byte(proofID + ":" + evidenceHash + ":carbongero"))
	enc := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(sum[:])
	txID := strings.ToUpper(enc)
	if len(txID) > 52 {
		txID = txID[:52]
	}
	return txID
}

// ExplorerURL returns a Lora explorer link for a TestNet transaction.
// Empty for simulated anchors (no on-chain record exists).
func ExplorerURL(network, txID string) string {
	if network != "algorand-testnet" || txID == "" {
		return ""
	}
	return "https://lora.algokit.io/testnet/transaction/" + txID
}
