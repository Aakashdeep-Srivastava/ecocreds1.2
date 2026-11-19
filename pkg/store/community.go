package store

import (
	"fmt"
	"time"

	"carbongero/pkg/db"
)

// PledgeItem is one public pledge shown on the Global Meter wall.
type PledgeItem struct {
	Name      string    `json:"name"`
	Message   string    `json:"message"`
	TargetKg  float64   `json:"targetKg"`
	CreatedAt time.Time `json:"createdAt"`
}

// CommunityMeter aggregates collective impact + participation for the public
// "Global Meter" (the top retention screen in peer apps).
type CommunityMeter struct {
	AvoidedKg     float64      `json:"avoidedKg"`     // real verified avoided CO2 (from proofs)
	PledgedKg     float64      `json:"pledgedKg"`     // future CO2 pledged (kg/yr)
	Participants  int          `json:"participants"`  // total pledges + waitlist signups
	Pledges       int          `json:"pledges"`
	Waitlist      int          `json:"waitlist"`
	Credits       int          `json:"credits"`       // carbon-credit certificates issued
	RecentPledges []PledgeItem `json:"recentPledges"`
}

// AddSignup records a pledge or waitlist signup ("get involved / book for future").
func AddSignup(kind, name, email, role, message string, targetKg float64) error {
	if kind != "PLEDGE" && kind != "WAITLIST" {
		return fmt.Errorf("kind must be PLEDGE or WAITLIST")
	}
	if targetKg < 0 {
		targetKg = 0
	}
	conn, err := db.Conn()
	if err != nil {
		return err
	}
	id := fmt.Sprintf("CMT-%d", time.Now().UnixNano())
	_, err = conn.Exec(
		`INSERT INTO community_signups (id,kind,name,email,role,message,target_kg)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)`,
		id, kind, nullStr(name), nullStr(email), nullStr(role), nullStr(message), targetKg,
	)
	return err
}

// GetCommunityMeter returns collective impact for the public Global Meter.
func GetCommunityMeter() (*CommunityMeter, error) {
	conn, err := db.Conn()
	if err != nil {
		return nil, err
	}
	m := &CommunityMeter{RecentPledges: []PledgeItem{}}
	_ = conn.QueryRow(`SELECT coalesce(sum(impact_value),0) FROM sustainability_proofs`).Scan(&m.AvoidedKg)
	_ = conn.QueryRow(`SELECT coalesce(sum(target_kg),0) FROM community_signups WHERE kind='PLEDGE'`).Scan(&m.PledgedKg)
	_ = conn.QueryRow(`SELECT count(*) FROM community_signups WHERE kind='PLEDGE'`).Scan(&m.Pledges)
	_ = conn.QueryRow(`SELECT count(*) FROM community_signups WHERE kind='WAITLIST'`).Scan(&m.Waitlist)
	_ = conn.QueryRow(`SELECT count(*) FROM carbon_credits`).Scan(&m.Credits)
	m.Participants = m.Pledges + m.Waitlist

	rows, err := conn.Query(
		`SELECT coalesce(name,'Anonymous'), coalesce(message,''), target_kg, created_at
		 FROM community_signups WHERE kind='PLEDGE' ORDER BY created_at DESC LIMIT 8`)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var p PledgeItem
			if err := rows.Scan(&p.Name, &p.Message, &p.TargetKg, &p.CreatedAt); err == nil {
				m.RecentPledges = append(m.RecentPledges, p)
			}
		}
	}
	return m, nil
}
