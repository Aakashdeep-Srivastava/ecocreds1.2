package handler

import (
	"encoding/json"
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves POST /api/reward-claim — the freemium gate: settle the user's
// accrued reward balance to their connected Algorand wallet. Requires a wallet
// address (the point at which the user must have logged in with Pera).
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var body struct {
		Address string `json:"address"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Address == "" {
		httpx.Error(w, http.StatusBadRequest, "wallet address required")
		return
	}
	res, err := store.ClaimRewards(body.Address)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}
