package handler

import (
	"net/http"
	"time"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/health. With ?ping=1 it also records a keep-alive
// heartbeat (the Vercel cron target) — folded in here to stay under the Hobby
// plan's 12-serverless-function limit.
func Handler(w http.ResponseWriter, r *http.Request) {
	status, dbStatus := "ok", "ok"
	if err := store.HealthCheck(); err != nil {
		status, dbStatus = "degraded", err.Error()
	}
	resp := map[string]any{
		"status":  status,
		"service": "carbongero-api",
		"db":      dbStatus,
		"time":    time.Now().UTC().Format(time.RFC3339),
	}
	if r.URL.Query().Get("ping") != "" {
		if last, count, err := store.Heartbeat(); err == nil {
			resp["heartbeat"] = map[string]any{"lastPing": last, "pingCount": count}
		}
	}
	httpx.JSON(w, http.StatusOK, resp)
}
