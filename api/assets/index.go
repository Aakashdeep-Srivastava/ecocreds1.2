package handler

import (
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/assets — the CarbonGero reward-ASA descriptor so the
// client knows which asset id to opt into and whether on-chain issuance is live.
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"reward": store.RewardAssetInfo()})
}
