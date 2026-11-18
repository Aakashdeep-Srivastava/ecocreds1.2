package handler

import (
	"net/http"
	"time"

	"carbongero/internal/httpx"
	"carbongero/internal/store"
)

// Handler serves GET /api/health.
func Handler(w http.ResponseWriter, r *http.Request) {
	status, dbStatus := "ok", "ok"
	if err := store.HealthCheck(); err != nil {
		status, dbStatus = "degraded", err.Error()
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"status":  status,
		"service": "carbongero-api",
		"db":      dbStatus,
		"time":    time.Now().UTC().Format(time.RFC3339),
	})
}
