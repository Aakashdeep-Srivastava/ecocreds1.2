package handler

import (
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/account?address=... — a wallet's live on-chain ASA
// holdings via the Algorand indexer (PRD §6.1 asset indexing / tx monitoring).
// With no address it uses the demo user's linked wallet.
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	snap, err := store.GetAccountSnapshot(r.URL.Query().Get("address"))
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, snap)
}
