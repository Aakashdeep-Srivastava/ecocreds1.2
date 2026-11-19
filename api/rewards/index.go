package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/rewards — reward token summary/history, the reward-ASA
// descriptor, on-chain account holdings, and the freemium claim. Consolidated
// into one function to stay under the Hobby 12-function limit.
//
//	GET  /api/rewards                      → { summary, rewards }
//	GET  /api/rewards?resource=assets      → { reward }
//	GET  /api/rewards?resource=account&address=... → account snapshot (indexer)
//	POST /api/rewards  { action:"claim", address } → settle accrued balance on-chain
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		switch r.URL.Query().Get("resource") {
		case "assets":
			httpx.JSON(w, http.StatusOK, map[string]any{"reward": store.RewardAssetInfo()})
		case "account":
			snap, err := store.GetAccountSnapshot(r.URL.Query().Get("address"))
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, err.Error())
				return
			}
			httpx.JSON(w, http.StatusOK, snap)
		default:
			summary, err := store.GetRewardSummary()
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, err.Error())
				return
			}
			limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
			rewards, err := store.ListRewards(limit)
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, err.Error())
				return
			}
			httpx.JSON(w, http.StatusOK, map[string]any{"summary": summary, "rewards": rewards})
		}
	case http.MethodPost:
		var body struct {
			Action  string `json:"action"`
			Address string `json:"address"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Action != "claim" || body.Address == "" {
			httpx.Error(w, http.StatusBadRequest, "action:\"claim\" and address required")
			return
		}
		res, err := store.ClaimRewards(body.Address)
		if err != nil {
			httpx.Error(w, http.StatusBadRequest, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, res)
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
