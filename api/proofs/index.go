package handler

import (
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/proofs — the Proof of Sustainability registry.
func Handler(w http.ResponseWriter, r *http.Request) {
	proofs, err := store.ListProofs(50)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{"proofs": proofs, "count": len(proofs)})
}
