package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/reviews — the human peer-review queue (GET) and decisions
// (POST). PRD §5.4: AI assessment is advisory; a human verifier approves/rejects
// before a proof can become a sellable carbon credit.
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
		pending, err := store.ListPendingReviews(limit)
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, map[string]any{"pending": pending})
	case http.MethodPost:
		var body struct {
			ProofID  string `json:"proofId"`
			Decision string `json:"decision"`
			Notes    string `json:"notes"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.ProofID == "" {
			httpx.Error(w, http.StatusBadRequest, "proofId and decision required")
			return
		}
		res, err := store.SubmitReview(body.ProofID, body.Decision, body.Notes)
		if err != nil {
			httpx.Error(w, http.StatusBadRequest, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, res)
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
