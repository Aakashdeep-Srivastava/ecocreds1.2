package handler

import (
	"net/http"
	"os"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves GET /api/cron/keepalive — a minimal-compute DB keep-alive the
// Vercel cron hits on a schedule. If CRON_SECRET is set, require Vercel's
// `Authorization: Bearer <CRON_SECRET>` header (Vercel sends it automatically).
func Handler(w http.ResponseWriter, r *http.Request) {
	if secret := os.Getenv("CRON_SECRET"); secret != "" {
		if r.Header.Get("Authorization") != "Bearer "+secret {
			httpx.Error(w, http.StatusUnauthorized, "unauthorized")
			return
		}
	}
	lastPing, count, err := store.Heartbeat()
	if err != nil {
		httpx.Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, map[string]any{
		"ok":        true,
		"lastPing":  lastPing,
		"pingCount": count,
	})
}
