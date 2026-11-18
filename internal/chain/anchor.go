// Package chain anchors Proof-of-Sustainability records to Algorand.
//
// NOTE: this is a deterministic STUB for the MVP (PRD §6 / Phase 4). It derives
// an Algorand-style 52-character base32 transaction id from the proof id and
// evidence hash so the end-to-end flow is demonstrable. Real AlgoKit / testnet
// submission (ASA issuance, note field with the proof reference) is a follow-up
// and must never be represented as an on-chain-verified transaction until wired.
package chain

import (
	"crypto/sha512"
	"encoding/base32"
	"strings"
)

// Anchor returns the network label and a deterministic mock transaction id.
func Anchor(proofID, evidenceHash string) (network, txID string) {
	sum := sha512.Sum512_256([]byte(proofID + ":" + evidenceHash + ":carbongero"))
	enc := base32.StdEncoding.WithPadding(base32.NoPadding).EncodeToString(sum[:])
	txID = strings.ToUpper(enc)
	if len(txID) > 52 {
		txID = txID[:52]
	}
	return "algorand-testnet", txID
}

// ExplorerURL returns a Lora/AlgoExplorer-style link for a testnet tx.
func ExplorerURL(txID string) string {
	return "https://lora.algokit.io/testnet/transaction/" + txID
}
