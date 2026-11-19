package handler

import (
	"encoding/json"
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/community — the public Global Meter (GET) and
// pledge/waitlist signups (POST). No auth: this is the public "get involved"
// surface.
//
//	GET  /api/community → { meter }
//	POST /api/community  { kind:"PLEDGE"|"WAITLIST", name, email, role, message, targetKg }
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		meter, err := store.GetCommunityMeter()
		if err != nil {
			httpx.Error(w, http.StatusInternalServerError, err.Error())
			return
		}
		httpx.JSON(w, http.StatusOK, map[string]any{"meter": meter})
	case http.MethodPost:
		var body struct {
			Kind     string  `json:"kind"`
			Name     string  `json:"name"`
			Email    string  `json:"email"`
			Role     string  `json:"role"`
			Message  string  `json:"message"`
			TargetKg float64 `json:"targetKg"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			httpx.Error(w, http.StatusBadRequest, "invalid JSON body")
			return
		}
		if err := store.AddSignup(body.Kind, body.Name, body.Email, body.Role, body.Message, body.TargetKg); err != nil {
			httpx.Error(w, http.StatusBadRequest, err.Error())
			return
		}
		httpx.JSON(w, http.StatusCreated, map[string]any{"ok": true})
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}
