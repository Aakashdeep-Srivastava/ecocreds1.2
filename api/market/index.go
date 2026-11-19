package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"carbongero/pkg/httpx"
	"carbongero/pkg/store"
)

// Handler serves /api/market — the peer-review queue and the carbon-credit
// registry + exchange, consolidated into one function (Hobby 12-function limit).
//
//	GET  /api/market?resource=reviews                → { pending }
//	GET  /api/market?resource=credits                → { summary, credits, issuable }
//	GET  /api/market?resource=credits&scope=marketplace|mine → { credits }
//	GET  /api/market?resource=credits&id=CC-...       → { credit, events }
//	POST /api/market  { op:"review", proofId, decision, notes }
//	POST /api/market  { op:"issue",  proofId }
//	POST /api/market  { op:"list"|"buy"|"retire", creditId, price?, buyer?, buyerAddress? }
func Handler(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		q := r.URL.Query()
		limit, _ := strconv.Atoi(q.Get("limit"))
		switch q.Get("resource") {
		case "reviews":
			pending, err := store.ListPendingReviews(limit)
			if err != nil {
				httpx.Error(w, http.StatusInternalServerError, err.Error())
				return
			}
			httpx.JSON(w, http.StatusOK, map[string]any{"pending": pending})
		case "credits":
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
		default:
			httpx.Error(w, http.StatusBadRequest, "resource must be reviews or credits")
		}
	case http.MethodPost:
		var body struct {
			Op           string   `json:"op"`
			ProofID      string   `json:"proofId"`
			Decision     string   `json:"decision"`
			Notes        string   `json:"notes"`
			CreditID     string   `json:"creditId"`
			CreditIDs    []string `json:"creditIds"`
			Price        float64  `json:"price"`
			Buyer        string   `json:"buyer"`
			BuyerAddress string   `json:"buyerAddress"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			httpx.Error(w, http.StatusBadRequest, "invalid JSON body")
			return
		}
		switch body.Op {
		case "review":
			res, err := store.SubmitReview(body.ProofID, body.Decision, body.Notes)
			respond(w, res, err)
		case "issue":
			res, err := store.IssueCredit(body.ProofID)
			respondCreated(w, res, err)
		case "list":
			res, err := store.SetListing(body.CreditID, body.Price)
			respond(w, res, err)
		case "buy":
			res, err := store.BuyCredit(body.CreditID, body.Buyer, body.BuyerAddress)
			respond(w, res, err)
		case "buy-bulk":
			res, err := store.BuyCreditsBulk(body.CreditIDs, body.Buyer, body.BuyerAddress)
			respond(w, res, err)
		case "retire":
			res, err := store.RetireCredit(body.CreditID)
			respond(w, res, err)
		default:
			httpx.Error(w, http.StatusBadRequest, "op must be review, issue, list, buy or retire")
		}
	default:
		httpx.Error(w, http.StatusMethodNotAllowed, "method not allowed")
	}
}

func respond(w http.ResponseWriter, res any, err error) {
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusOK, res)
}

func respondCreated(w http.ResponseWriter, res any, err error) {
	if err != nil {
		httpx.Error(w, http.StatusBadRequest, err.Error())
		return
	}
	httpx.JSON(w, http.StatusCreated, res)
}
