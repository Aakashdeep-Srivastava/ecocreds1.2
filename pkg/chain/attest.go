package chain

import (
	"context"
	"encoding/json"
	"os"
	"time"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/v2/crypto"
	"github.com/algorand/go-algorand-sdk/v2/mnemonic"
	"github.com/algorand/go-algorand-sdk/v2/transaction"
)

// submitNote sends a 0-ALGO self-payment carrying an arbitrary JSON note on
// Algorand TestNet and returns the confirmed tx id. Shared by attestation and
// certificate anchoring.
func submitNote(payload map[string]string) (string, error) {
	sk, err := mnemonic.ToPrivateKey(os.Getenv("ALGORAND_MNEMONIC"))
	if err != nil {
		return "", err
	}
	acct, err := crypto.AccountFromPrivateKey(sk)
	if err != nil {
		return "", err
	}
	client, err := algod.MakeClient(algodEndpoint(), "")
	if err != nil {
		return "", err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	sp, err := client.SuggestedParams().Do(ctx)
	if err != nil {
		return "", err
	}
	note, _ := json.Marshal(payload)
	txn, err := transaction.MakePaymentTxn(acct.Address.String(), acct.Address.String(), 0, note, "", sp)
	if err != nil {
		return "", err
	}
	txID, stx, err := crypto.SignTransaction(sk, txn)
	if err != nil {
		return "", err
	}
	if _, err = client.SendRawTransaction(stx).Do(ctx); err != nil {
		return "", err
	}
	if _, err = transaction.WaitForConfirmation(client, txID, 6, ctx); err != nil {
		return "", err
	}
	return txID, nil
}

// Attest records a verifier's peer-review decision on-chain (note field), giving
// an independently checkable attestation trail. Config-gated with a simulated
// fallback, like Anchor.
func Attest(proofID, verifier, decision string) (network, txID string, live bool) {
	if configured() {
		if tx, err := submitNote(map[string]string{
			"app": "carbongero", "kind": "review",
			"proof": proofID, "verifier": verifier, "decision": decision,
		}); err == nil {
			return "algorand-testnet", tx, true
		}
	}
	return "simulated", mockTx(proofID, "review:"+decision), false
}

// AnchorCertificate anchors a carbon-credit certificate's serial + evidence hash
// on-chain. Config-gated with a simulated fallback.
func AnchorCertificate(creditID, serial, evidenceHash string) (network, txID string, live bool) {
	if configured() {
		if tx, err := submitNote(map[string]string{
			"app": "carbongero", "kind": "carbon-credit",
			"credit": creditID, "serial": serial, "evidence": evidenceHash,
		}); err == nil {
			return "algorand-testnet", tx, true
		}
	}
	return "simulated", mockTx(creditID, "credit:"+serial), false
}

// AnchorCreditEvent anchors a marketplace event (sale/retirement) on-chain so
// the credit's provenance is independently checkable. Config-gated.
func AnchorCreditEvent(creditID, kind, detail string) (network, txID string, live bool) {
	if configured() {
		if tx, err := submitNote(map[string]string{
			"app": "carbongero", "kind": kind, "credit": creditID, "detail": detail,
		}); err == nil {
			return "algorand-testnet", tx, true
		}
	}
	return "simulated", mockTx(creditID, kind+":"+detail), false
}
