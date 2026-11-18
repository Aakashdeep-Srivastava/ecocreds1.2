package handler

import (
	"encoding/json"
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves POST /api/submit — the end-to-end recycling → Proof of
// Sustainability flow (activity → evidence hash → AI stub → carbon accounting
// → proof → Algorand anchor).
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var in store.SubmitInput
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		httpx.Error(w, http.StatusBadRequest, "invalid JSON body")
		return
	}
	res, err := store.Submit(in)
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, res)
}
