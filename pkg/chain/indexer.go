package chain

import (
	"context"
	"os"
	"time"

	"github.com/algorand/go-algorand-sdk/v2/client/v2/indexer"
)

// indexerEndpoint returns the TestNet indexer endpoint (AlgoNode public
// indexer by default — no token required).
func indexerEndpoint() string {
	if v := os.Getenv("ALGORAND_INDEXER"); v != "" {
		return v
	}
	return "https://testnet-idx.algonode.cloud"
}

// Holding is one on-chain ASA position for an account.
type Holding struct {
	ASAID    uint64 `json:"asaId"`
	Amount   uint64 `json:"amount"`
	IsFrozen bool   `json:"isFrozen"`
	// UnitName is filled in for assets CarbonGero knows about (the reward ASA).
	UnitName string `json:"unitName,omitempty"`
}

// AccountAssets returns an account's ASA holdings from the Algorand indexer.
// Used for live on-chain reward-balance display and asset monitoring.
func AccountAssets(address string) ([]Holding, error) {
	client, err := indexer.MakeClient(indexerEndpoint(), "")
	if err != nil {
		return nil, err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()

	_, account, err := client.LookupAccountByID(address).Do(ctx)
	if err != nil {
		return nil, err
	}

	rewardID := RewardASAID()
	out := make([]Holding, 0, len(account.Assets))
	for _, a := range account.Assets {
		h := Holding{ASAID: a.AssetId, Amount: a.Amount, IsFrozen: a.IsFrozen}
		if rewardID != 0 && a.AssetId == rewardID {
			h.UnitName = RewardUnitName
		}
		out = append(out, h)
	}
	return out, nil
}

// RewardBalanceOnChain returns the account's reward-ASA balance from the
// indexer (0 when the reward ASA is unset or the account doesn't hold it).
func RewardBalanceOnChain(address string) (uint64, error) {
	rewardID := RewardASAID()
	if rewardID == 0 || address == "" {
		return 0, nil
	}
	holdings, err := AccountAssets(address)
	if err != nil {
		return 0, err
	}
	for _, h := range holdings {
		if h.ASAID == rewardID {
			return h.Amount, nil
		}
	}
	return 0, nil
}
