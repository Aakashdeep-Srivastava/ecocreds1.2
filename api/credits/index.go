package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/credits — the carbon-credit registry + exchange.
//
//	GET  /api/credits            → { summary, credits(all), issuable[] }
//	GET  /api/credits?scope=...  → { credits }   (marketplace | mine)
//	GET  /api/credits?id=CC-...  → { credit, events }   (certificate view)
//	POST /api/credits            → issue a credit from an APPROVED proof {proofId}
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		q := r.URL.Query()
		if id := q.Get("id"); id != "" {
			credit, err := store.GetCreditByID(id)
			if err != nil {
				httpx.Error(w, http.StatusNotFound, err.Error())
				return
			}
			events, _ := store.GetCreditEvents(id)
			httpx.JSON(w, http.StatusOK, map[string]any{"credit": credit, "events": events})
			return
		}
		limit, _ := strconv.Atoi(q.Get("limit"))
		if scope := q.Get("scope"); scope == "marketplace" || scope == "mine" {
			credits, err := store.ListCredits(scope, limit)
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, err.Error())
				return
			}
			httpx.JSON(w, http.StatusOK, map[string]any{"credits": credits})
			return
		}
		summary, err := store.GetCreditSummary()
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, err.Error())
			return
		}
		credits, _ := store.ListCredits("", limit)
		issuable, _ := store.ListIssuableProofs(limit)
		httpx.JSON(w, http.StatusOK, map[string]any{"summary": summary, "credits": credits, "issuable": issuable})
	case http.MethodPost:
		var body struct {
			ProofID string `json:"proofId"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.ProofID == "" {
			httpx.Error(w, http.StatusBadRequest, "proofId required")
			return
		}
		credit, err := store.IssueCredit(body.ProofID)
		if err != nil {
			httpx.Error(w, http.StatusBadRequest, err.Error())
			return
		}
		httpx.JSON(w, http.StatusCreated, credit)
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
