package chain

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/v2/crypto"
	"github.com/algorand/go-algorand-sdk/v2/mnemonic"
	"github.com/algorand/go-algorand-sdk/v2/transaction"
)

// The CarbonGero reward token is a voluntary platform reward (PRD §6.2.A) —
// NOT a certified carbon credit. It is a whole-number ASA (0 decimals).
const (
	RewardUnitName  = "CGRO"
	RewardAssetName = "CarbonGero Reward"
)

// Reward issuance statuses (also persisted on reward_issuances.status).
const (
	RewardIssued   = "ISSUED"         // on-chain ASA transfer confirmed
	RewardSimulated = "SIMULATED"     // no funded treasury / reward ASA — simulated tx
	RewardOptInReq = "OPTIN_REQUIRED" // recipient wallet must opt into the ASA first
	RewardPending  = "PENDING_WALLET" // no wallet linked yet
	RewardFailed   = "FAILED"         // on-chain attempt errored
)

// RewardResult reports the outcome of a reward issuance attempt.
type RewardResult struct {
	Network string `json:"network"`
	TxID    string `json:"txId"`
	ASAID   uint64 `json:"asaId"`
	Status  string `json:"status"`
}

// RewardASAID returns the configured reward ASA id (ALGORAND_REWARD_ASA), or 0
// when unset — in which case issuance runs in simulated mode.
func RewardASAID() uint64 {
	if v := os.Getenv("ALGORAND_REWARD_ASA"); v != "" {
		if id, err := strconv.ParseUint(v, 10, 64); err == nil {
			return id
		}
	}
	return 0
}

// RewardLive reports whether real on-chain reward issuance is possible
// (funded treasury account AND a configured reward ASA).
func RewardLive() bool { return configured() && RewardASAID() != 0 }

// IssueReward transfers `amount` reward-ASA units from the platform treasury to
// the user's wallet. It mirrors Anchor's design: config-gated, with a graceful
// simulated fallback so the submit flow never breaks.
//
//   - no wallet linked        → PENDING_WALLET (no tx)
//   - treasury/ASA not set    → SIMULATED (deterministic mock tx)
//   - wallet not opted in      → OPTIN_REQUIRED (no tx; actionable by the user)
//   - transfer confirmed       → ISSUED (real on-chain tx)
//   - any on-chain error       → FAILED (no tx)
func IssueReward(toAddress string, amount uint64) RewardResult {
	asaID := RewardASAID()
	if toAddress == "" {
		return RewardResult{Network: "simulated", Status: RewardPending, ASAID: asaID}
	}
	if !RewardLive() {
		return RewardResult{
			Network: "simulated", Status: RewardSimulated, ASAID: asaID,
			TxID: mockTx(toAddress, fmt.Sprintf("reward:%d", amount)),
		}
	}

	sk, err := mnemonic.ToPrivateKey(os.Getenv("ALGORAND_MNEMONIC"))
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	acct, err := crypto.AccountFromPrivateKey(sk)
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}

	client, err := algod.MakeClient(algodEndpoint(), "")
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	ctx, cancel := context.WithTimeout(context.Background(), 25*time.Second)
	defer cancel()

	// The recipient must opt into the ASA before it can receive it. This is a
	// normal, actionable state — surface it rather than failing.
	if _, err := client.AccountAssetInformation(toAddress, asaID).Do(ctx); err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardOptInReq, ASAID: asaID}
	}

	sp, err := client.SuggestedParams().Do(ctx)
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	note, _ := json.Marshal(map[string]string{"app": "carbongero", "kind": "reward"})

	txn, err := transaction.MakeAssetTransferTxn(
		acct.Address.String(), toAddress, amount, note, sp, "", asaID,
	)
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	txID, stx, err := crypto.SignTransaction(sk, txn)
	if err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	if _, err = client.SendRawTransaction(stx).Do(ctx); err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	if _, err = transaction.WaitForConfirmation(client, txID, 6, ctx); err != nil {
		return RewardResult{Network: "algorand-testnet", Status: RewardFailed, ASAID: asaID}
	}
	return RewardResult{Network: "algorand-testnet", TxID: txID, ASAID: asaID, Status: RewardIssued}
}

// ExplorerAssetURL links to a reward/credit ASA on the Lora TestNet explorer.
func ExplorerAssetURL(asaID uint64) string {
	if asaID == 0 {
		return ""
	}
	return "https://lora.algokit.io/testnet/asset/" + strconv.FormatUint(asaID, 10)
}

// ExplorerAccountURL links to an account on the Lora TestNet explorer.
func ExplorerAccountURL(address string) string {
	if address == "" {
		return ""
	}
	return "https://lora.algokit.io/testnet/account/" + address
}
