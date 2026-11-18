package handler

import (
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/stats — registry aggregates for dashboards.
func Handler(w http.ResponseWriter, r *http.Request) {
	s, err := store.GetStats()
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, s)
}
