package handler

import (
	"encoding/json"
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/wallet — associate (POST) or read (GET) the user's
// Algorand wallet address (PRD FR-006).
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		var body struct {
			Address string `json:"address"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Address == "" {
			httpx.Error(w, http.StatusBadRequest, "address required")
			return
		}
		user, err := store.LinkWallet(body.Address)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, map[string]any{"address": body.Address, "status": "linked", "user": user})
	case http.MethodGet:
		addr, err := store.GetWallet()
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, map[string]string{"address": addr})
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
