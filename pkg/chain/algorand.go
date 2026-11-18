package chain

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/v2/crypto"
	"github.com/algorand/go-algorand-sdk/v2/mnemonic"
	"github.com/algorand/go-algorand-sdk/v2/transaction"
)

// algodEndpoint returns the TestNet algod endpoint (AlgoNode public node by
// default — no token required).
func algodEndpoint() string {
	if v := os.Getenv("ALGORAND_ALGOD"); v != "" {
		return v
	}
	return "https://testnet-api.algonode.cloud"
}

// configured reports whether real anchoring is enabled (a funded account).
func configured() bool { return os.Getenv("ALGORAND_MNEMONIC") != "" }

// AnchorAccount returns the configured sender address (for funding / status).
func AnchorAccount() (string, error) {
	mn := os.Getenv("ALGORAND_MNEMONIC")
	if mn == "" {
		return "", fmt.Errorf("ALGORAND_MNEMONIC not set")
	}
	sk, err := mnemonic.ToPrivateKey(mn)
	if err != nil {
		return "", err
	}
	acct, err := crypto.AccountFromPrivateKey(sk)
	if err != nil {
		return "", err
	}
	return acct.Address.String(), nil
}

// realAnchor submits a 0-ALGO self-payment to Algorand TestNet with the proof
// reference in the note field (max 1024 bytes). Returns the on-chain tx id.
func realAnchor(proofID, evidenceHash string) (string, error) {
	mn := os.Getenv("ALGORAND_MNEMONIC")
	sk, err := mnemonic.ToPrivateKey(mn)
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

	note, _ := json.Marshal(map[string]string{
		"app":      "carbongero",
		"proof":    proofID,
		"evidence": evidenceHash,
	})

	txn, err := transaction.MakePaymentTxn(
		acct.Address.String(), acct.Address.String(), 0, note, "", sp,
	)
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
