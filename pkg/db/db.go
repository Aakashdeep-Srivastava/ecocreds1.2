// Package db provides a lazily-initialised, serverless-friendly Postgres
// connection (Neon). A single *sql.DB is reused across warm function
// invocations; the pool is kept intentionally small for serverless.
package db

import (
	"database/sql"
	"fmt"
	"os"
	"sync"
	"time"

	_ "github.com/lib/pq"
)

var (
	once sync.Once
	conn *sql.DB
	err  error
)

// Conn returns the shared database handle, opening it on first use.
func Conn() (*sql.DB, error) {
	once.Do(func() {
		dsn := os.Getenv("DATABASE_URL")
		if dsn == "" {
			err = fmt.Errorf("DATABASE_URL is not set")
			return
		}
		conn, err = sql.Open("postgres", dsn)
		if err != nil {
			return
		}
		conn.SetMaxOpenConns(2)
		conn.SetMaxIdleConns(1)
		conn.SetConnMaxLifetime(2 * time.Minute)
		err = conn.Ping()
	})
	return conn, err
}
