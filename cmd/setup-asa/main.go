// Command setup-asa creates the CarbonGero Reward (CGRO) Algorand Standard Asset
// on TestNet and prints its asset id. Run it locally with a FUNDED TestNet
// account so no secret ever leaves your machine:
//
//	# 1. fund a TestNet account (Pera wallet or a TestNet dispenser)
//	# 2. export its 25-word mnemonic locally (NOT in any shared chat)
//	export ALGORAND_MNEMONIC="word1 word2 ... word25"
//	go run ./cmd/setup-asa
//	# 3. it prints the account address (to verify funding) and the new ASA id
//	# 4. set these in Vercel env (Production) and redeploy:
//	#      ALGORAND_MNEMONIC   = <the same mnemonic>
//	#      ALGORAND_REWARD_ASA = <printed asset id>
//
// Once both env vars are set, reward issuance + claims flip from simulated to
// real on-chain transfers automatically — no code change.
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/v2/crypto"
	"github.com/algorand/go-algorand-sdk/v2/mnemonic"
	"github.com/algorand/go-algorand-sdk/v2/transaction"
)

func main() {
	mn := os.Getenv("ALGORAND_MNEMONIC")
	if mn == "" {
		fmt.Fprintln(os.Stderr, "error: set ALGORAND_MNEMONIC to a FUNDED TestNet account's 25-word mnemonic")
		os.Exit(1)
	}
	sk, err := mnemonic.ToPrivateKey(mn)
	must(err, "invalid mnemonic")
	acct, err := crypto.AccountFromPrivateKey(sk)
	must(err, "derive account")
	addr := acct.Address.String()

	endpoint := os.Getenv("ALGORAND_ALGOD")
	if endpoint == "" {
		endpoint = "https://testnet-api.algonode.cloud"
	}
	client, err := algod.MakeClient(endpoint, "")
	must(err, "algod client")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Sanity-check the account is funded.
	info, err := client.AccountInformation(addr).Do(ctx)
	must(err, "account info (is it funded?)")
	fmt.Printf("Treasury account : %s\n", addr)
	fmt.Printf("Balance          : %d microAlgos\n", info.Amount)
	if info.Amount < 200_000 {
		fmt.Fprintln(os.Stderr, "error: balance too low — fund this address at a TestNet dispenser first")
		os.Exit(1)
	}

	sp, err := client.SuggestedParams().Do(ctx)
	must(err, "suggested params")

	// Create CGRO: 10,000,000,000 whole tokens, 0 decimals. The creator holds
	// manager/reserve/freeze/clawback so the platform can administer the asset.
	const total = uint64(10_000_000_000)
	txn, err := transaction.MakeAssetCreateTxn(
		addr, nil, sp, total, 0, false,
		addr, addr, addr, addr,
		"CGRO", "CarbonGero Reward", "https://xecocreds.vercel.app", "",
	)
	must(err, "make asset-create txn")

	txID, stx, err := crypto.SignTransaction(sk, txn)
	must(err, "sign")
	_, err = client.SendRawTransaction(stx).Do(ctx)
	must(err, "send")
	confirmed, err := transaction.WaitForConfirmation(client, txID, 6, ctx)
	must(err, "wait for confirmation")

	fmt.Printf("\n✅ Created CGRO ASA\n")
	fmt.Printf("ALGORAND_REWARD_ASA = %d\n", confirmed.AssetIndex)
	fmt.Printf("Tx                  = %s\n", txID)
	fmt.Printf("Explorer            = https://lora.algokit.io/testnet/asset/%d\n", confirmed.AssetIndex)
	fmt.Printf("\nSet ALGORAND_MNEMONIC + ALGORAND_REWARD_ASA in Vercel and redeploy.\n")
}

func must(err error, ctx string) {
	if err != nil {
		fmt.Fprintf(os.Stderr, "error: %s: %v\n", ctx, err)
		os.Exit(1)
	}
}
