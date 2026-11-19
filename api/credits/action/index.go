package handler

import (
	"encoding/json"
	"net/http"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves POST /api/credits/action — exchange actions on a credit.
//
//	{ "action": "list",   "creditId": "...", "price": 12.5 }
//	{ "action": "buy",    "creditId": "...", "buyer": "Acme Corp", "buyerAddress": "..." }
//	{ "action": "retire", "creditId": "..." }
func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
		return
	}
	var body struct {
		Action       string  `json:"action"`
		CreditID     string  `json:"creditId"`
		Price        float64 `json:"price"`
		Buyer        string  `json:"buyer"`
		BuyerAddress string  `json:"buyerAddress"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.CreditID == "" {
		httpx.Error(w, http.StatusBadRequest, "creditId and action required")
		return
	}
	var (
		credit *store.CarbonCredit
		err    error
	)
	switch body.Action {
	case "list":
		credit, err = store.SetListing(body.CreditID, body.Price)
	case "buy":
		credit, err = store.BuyCredit(body.CreditID, body.Buyer, body.BuyerAddress)
	case "retire":
		credit, err = store.RetireCredit(body.CreditID)
	default:
		httpx.Error(w, http.StatusBadRequest, "action must be list, buy or retire")
		return
	}
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, credit)
}
