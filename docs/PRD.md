# CarbonGero
## Product Requirements Document (PRD) & Technical Architecture Specification

**Version:** 2.0
**Date:** 18 November 2026
**Product:** CarbonGero (formerly EcoCreds)
**Parent Company:** Xphora AI Technology Pvt. Ltd.
**Product Category:** ClimateTech · GreenTech · Blockchain Infrastructure · AI
**Blockchain:** Algorand
**Document Status:** Proposed Technical Baseline

---

# 1. Executive Summary

CarbonGero is an open-source, AI-powered Proof of Sustainability and carbon asset infrastructure platform designed to capture, validate, quantify, record and monetize measurable environmental activities.

The platform connects individuals, businesses, sustainability projects, enterprises and environmental organizations through a common verification and asset infrastructure.

CarbonGero aims to solve five fundamental problems:

1. Lack of reliable evidence for sustainability claims.
2. Fragmented environmental impact measurement.
3. Limited transparency in carbon accounting.
4. Risk of duplicate environmental claims and credit issuance.
5. Lack of accessible infrastructure for converting verified environmental outcomes into traceable digital assets.

### Product Vision

Build a transparent and interoperable sustainability infrastructure where environmental actions can be verified, measured and represented through cryptographically traceable digital records.

### Core Product Pillars

| Pillar | Description |
|---|---|
| Proof of Sustainability | Evidence-backed records of environmental actions |
| AI Verification | Automated evidence analysis and impact assessment |
| Carbon Accounting | Emission reduction and removal quantification |
| Algorand Infrastructure | Immutable records and tokenized assets |
| ESG Intelligence | Sustainability analytics and reporting |

# 2. Product Objectives

### Primary objectives

- Establish a standardized digital record for sustainability activities.
- Automate initial evidence assessment using AI.
- Create auditable environmental impact records.
- Prevent duplicate submissions and double counting.
- Enable eligible carbon assets to be represented on Algorand.
- Provide enterprises with measurable sustainability data.
- Develop an open-source infrastructure that third-party applications can integrate with.

### Success metrics

| Metric | Initial target |
|---|---:|
| Evidence processing time | Under 60 seconds |
| Automated verification availability | 99% API availability target |
| Duplicate detection | Above 95% precision target |
| Verification audit coverage | 100% |
| Blockchain transaction traceability | 100% of issued assets |
| Evidence-to-decision traceability | 100% |

Targets are engineering objectives for the MVP, not demonstrated performance claims.

# 3. Target Users & Stakeholders

### 3.1 Individual users

- Individuals participating in recycling.
- Users adopting sustainable transportation.
- Individuals using renewable energy.
- Consumers participating in verified sustainability programs.

### 3.2 Businesses and MSMEs

- Small businesses tracking environmental performance.
- Manufacturers measuring waste reduction.
- Organizations tracking energy consumption.
- Businesses preparing ESG reports.

### 3.3 Sustainability project developers

- Waste management organizations.
- Renewable energy projects.
- Carbon reduction initiatives.
- Environmental organizations.

### 3.4 Enterprises and institutional buyers

- Corporates purchasing eligible environmental credits.
- ESG and sustainability teams.
- Organizations monitoring environmental impact.
- Carbon market participants.

### 3.5 Platform administrators and verifiers

- CarbonGero administrators.
- Independent verification organizations.
- Project auditors.
- Methodology administrators.

# 4. Product Scope

## 4.1 Core modules

| Module | Priority | Description |
|---|---|---|
| User & Organization Management | P0 | Authentication, identity and roles |
| Sustainability Activity Management | P0 | Activity creation and submission |
| Evidence Management | P0 | Images, documents and supporting data |
| AI Verification Engine | P0 | Evidence classification and assessment |
| Proof of Sustainability Registry | P0 | Permanent traceable sustainability records |
| Carbon Accounting Engine | P0 | Emission impact calculations |
| Algorand Integration | P0 | On-chain proof and asset issuance |
| Asset Management | P1 | Digital asset lifecycle |
| Sustainability Dashboard | P1 | Environmental performance |
| ESG Reporting | P1 | Reports and exportable records |
| Marketplace | P2 | Discovery and transfer of eligible assets |
| Developer API & SDK | P1 | Third-party integration |

## 4.2 Supported sustainability activities

The system should support configurable activity categories.

1. Recycling and waste recovery.
2. Sustainable transportation.
3. Renewable energy adoption.
4. Verified carbon offset participation.
5. Sustainable purchasing.

Each activity must have its own evidence requirements, measurement methodology and verification rules.

**MVP focus:** Recycling and waste recovery.

The initial demo should support a user uploading a recycling photograph, receiving an AI-assisted assessment, submitting the activity for verification and generating a traceable sustainability record.

# 5. Detailed Functional Requirements

## 5.1 Identity and Access Management

**Objective:** Provide secure access for individuals, businesses and platform stakeholders.

Functional requirements:

- FR-001: User registration and login.
- FR-002: Email verification.
- FR-003: Organization registration.
- FR-004: Role-based access control.
- FR-005: User profile and sustainability preferences.
- FR-006: Wallet address association.
- FR-007: Organization verification status.
- FR-008: Account and session management.

Roles:

- Individual
- Business
- Project Developer
- Verifier
- Auditor
- Administrator
- Marketplace Buyer

## 5.2 Sustainability Activity Management

**Objective:** Capture environmental actions in a structured and measurable format.

Functional requirements:

- FR-009: Create sustainability activity.
- FR-010: Select activity category.
- FR-011: Upload evidence.
- FR-012: Capture activity timestamp and location where required.
- FR-013: Associate activity with a user or organization.
- FR-014: Track verification status.
- FR-015: Maintain historical activity records.

Activity states:

`DRAFT → SUBMITTED → PROCESSING → UNDER_REVIEW → VERIFIED / REJECTED`

A verified activity can subsequently enter the carbon accounting and asset eligibility workflow.

## 5.3 Evidence Management System

Supported evidence formats:

- JPEG
- PNG
- PDF
- Structured JSON
- CSV

Functional requirements:

- FR-016: Secure evidence uploads.
- FR-017: File metadata extraction.
- FR-018: Cryptographic SHA-256 hashing.
- FR-019: Evidence versioning.
- FR-020: Duplicate evidence detection.
- FR-021: Evidence access control.
- FR-022: Evidence retention and deletion policies.

Every evidence record should contain:

- Evidence ID
- Activity ID
- User ID
- File hash
- File location
- Submission timestamp
- Verification status
- AI assessment reference
- Reviewer information

Evidence files should remain in controlled off-chain storage. Only required proof references and hashes should be written on-chain.

## 5.4 AI Verification Engine

**Objective:** Automate preliminary evidence assessment and reduce manual verification overhead.

The AI engine will be developed as independent FastAPI microservices.

### AI capabilities

**A. Image Classification**

- Identify recyclable materials.
- Classify waste categories.
- Detect visible contamination.
- Identify potentially irrelevant images.
- Assess image quality.

**B. Evidence Validation**

- Compare uploaded evidence with the declared activity.
- Identify suspicious or duplicated submissions.
- Extract relevant metadata.
- Assign confidence scores.

**C. Sustainability Claim Assessment**

- Compare submitted claims with available evidence.
- Identify unsupported environmental claims.
- Flag inconsistencies for human review.

**D. Anomaly Detection**

- Repeated evidence detection.
- Unusual submission patterns.
- Suspicious activity volumes.
- Inconsistent user submissions.

### Verification output

Each AI assessment must return:

- Activity ID
- Evidence ID
- Classification
- Confidence score
- Validation findings
- Anomaly indicators
- Recommended action
- Model version
- Assessment timestamp

Possible outcomes:

`APPROVED_FOR_REVIEW | NEEDS_HUMAN_REVIEW | REJECTED`

AI approval must not independently establish carbon-credit eligibility.

## 5.5 Carbon Accounting Engine

**Objective:** Calculate environmental impact using documented methodologies.

The calculation engine must be independent of the AI verification engine.

### Calculation inputs

- Activity category.
- Quantity.
- Unit of measurement.
- Geographic location.
- Baseline emissions.
- Emission factors.
- Applicable methodology.
- Measurement period.
- Evidence references.

### Calculation output

- Activity ID.
- Baseline emissions.
- Project emissions.
- Net estimated reduction.
- Unit (kgCO2e or tCO2e).
- Methodology ID and version.
- Emission factor references.
- Calculation timestamp.
- Review status.

General calculation model:

`Net Emission Reduction = Baseline Emissions - Project Emissions - Leakage - Applicable Adjustments`

The actual methodology must define the relevant parameters and boundaries.

Important distinction:

- Estimated impact: Platform-calculated environmental impact.
- Verified impact: Impact assessed through an applicable verification process.
- Issuable carbon credit: Environmental outcome eligible for issuance under an applicable carbon-credit methodology and authorization process.

The system must never automatically convert every sustainability action into an offset.

## 5.6 Proof of Sustainability Registry

This is the central infrastructure layer of CarbonGero.

Every approved sustainability activity generates a unique Proof of Sustainability record.

### Proof structure

```json
{
  "proof_id": "POS-2026-000001",
  "activity_id": "ACT-000001",
  "user_id": "USR-000001",
  "activity_type": "RECYCLING",
  "evidence_hash": "sha256_hash",
  "verification_status": "VERIFIED",
  "impact": {
    "value": 12.5,
    "unit": "kgCO2e",
    "status": "ESTIMATED"
  },
  "methodology_id": "METH-001",
  "created_at": "2026-11-18T00:00:00Z",
  "blockchain_status": "PENDING"
}
```

Functional requirements:

- FR-023: Generate unique proof IDs.
- FR-024: Maintain proof-to-evidence relationships.
- FR-025: Record verification history.
- FR-026: Prevent duplicate proof issuance.
- FR-027: Maintain immutable audit history.
- FR-028: Generate public verification references.
- FR-029: Support proof verification through API.

The registry must distinguish between an internal verified activity record and a certified carbon-credit record.

# 6. Algorand Blockchain Infrastructure

**Blockchain:** Algorand

Algorand will provide the blockchain infrastructure for traceability, asset representation and transparent ownership records.

## 6.1 Blockchain responsibilities

- Sustainability proof anchoring.
- Asset issuance.
- Asset ownership tracking.
- Asset transfer records.
- Transaction verification.
- Immutable audit references.

## 6.2 Asset Architecture

Use Algorand Standard Assets (ASA) for eligible digital assets.

Two distinct asset classes are required.

### A. CarbonGero Sustainability Rewards

Internal platform rewards for verified activities.

Examples:
- Recycling rewards.
- Sustainable transportation rewards.
- Renewable energy participation rewards.

These rewards are not carbon offsets and must not be marketed as certified carbon credits.

### B. Carbon Credit Assets

Digital representations of eligible carbon credits.

Each asset must reference:

- Project ID.
- Issuing registry.
- Applicable methodology.
- Vintage.
- Credit quantity.
- Verification documentation.
- Serial number or registry identifier.
- Retirement status.
- Relevant transaction records.

The issuance process must preserve the relationship with the recognized underlying registry and prevent duplicate claims or issuance.

## 6.3 Smart Contract Requirements

The blockchain layer should implement:

- Asset creation.
- Authorized issuance.
- Asset transfer controls.
- Asset freeze and clawback controls where applicable.
- Retirement tracking.
- Administrative permissions.
- Proof reference storage.
- Transaction event indexing.

Smart contracts must be independently tested and reviewed before production deployment.

## 6.4 Blockchain transaction workflow

```text
Verified Sustainability Record
          |
          v
Carbon Accounting Assessment
          |
          v
Asset Eligibility Check
          |
          v
Authorized Issuance Approval
          |
          v
Algorand Asset Creation
          |
          v
Transaction Confirmation
          |
          v
On-chain Reference Mapping
          |
          v
CarbonGero Asset Registry
```

No asset issuance should occur solely because an AI model returned a positive result.

# 7. Marketplace & Asset Management

**Priority:** Phase 2

The marketplace will facilitate discovery and exchange of eligible environmental assets.

### Functional requirements

- FR-030: View available assets.
- FR-031: View project information.
- FR-032: View asset provenance.
- FR-033: View ownership history.
- FR-034: Initiate eligible asset transfers.
- FR-035: Record transaction references.
- FR-036: Support retirement status.
- FR-037: Maintain transaction audit logs.

### Asset lifecycle

`CREATED → ISSUED → AVAILABLE → TRANSFERRED → RETIRED`

The actual lifecycle must also accommodate suspended, frozen, cancelled and revoked states where applicable.

A token transfer does not automatically establish a valid carbon-offset claim. Retirement and claim attribution must be handled explicitly.

# 8. ESG Intelligence & Reporting

**Priority:** Phase 2

Enterprises should be able to generate sustainability performance reports using verified activity records and documented calculations.

### Dashboard components

- Total sustainability activities.
- Verified activities.
- Estimated CO2e impact.
- Verified carbon-credit quantity.
- Recycling and waste recovery statistics.
- Renewable energy participation.
- Organizational sustainability trends.
- Evidence and audit references.

### Reporting features

- Organization-level reporting.
- Monthly and annual summaries.
- Activity-level breakdown.
- Export to PDF and CSV.
- Evidence references.
- Methodology references.
- Audit trail.

The reporting engine must clearly label estimated versus independently verified figures.

# 9. Technical Architecture

## 9.1 Proposed Technology Stack

| Layer | Technology |
|---|---|
| Web Frontend | Next.js (16) |
| Mobile Application | React Native / Expo |
| Core Backend | Go (Golang) |
| AI Microservices | Python / FastAPI |
| Primary Database | PostgreSQL |
| Vector Database | pgvector (optional) |
| Cache | Redis |
| Queue Processing | Redis-based queues |
| Blockchain | Algorand |
| Blockchain SDK | Algorand SDK / AlgoKit |
| File Storage | Object storage |
| API Communication | REST / GraphQL where justified |
| Authentication | JWT / OAuth 2.0 |
| Containerization | Docker |
| Deployment | Cloud infrastructure |
| CI/CD | GitHub Actions |
| Monitoring | OpenTelemetry-compatible observability |

## 9.2 High-Level Architecture

```text
                 CLIENT APPLICATIONS
              ┌────────────────────────┐
              │ Next.js Web Application│
              │ React Native Mobile    │
              └────────────┬───────────┘
                           |
                           v
              ┌────────────────────────┐
              │     API GATEWAY        │
              │      Go (Golang)       │
              └────────────┬───────────┘
                           |
          ┌────────────────┼─────────────────┐
          |                |                 |
          v                v                 v
   User & Identity   Activity Service   Asset Service
          |                |                 |
          |                v                 |
          |         Evidence Service         |
          |                |                 |
          |                v                 |
          |        AI Verification           |
          |            FastAPI               |
          |                |                 |
          |                v                 |
          |       Carbon Accounting          |
          |                |                 |
          └────────────────┼─────────────────┘
                           |
                           v
              PROOF OF SUSTAINABILITY
                      REGISTRY
                           |
             ┌─────────────┴─────────────┐
             |                           |
             v                           v
       PostgreSQL                    Redis
             |
             v
       Blockchain Service
             |
             v
          Algorand
             |
             v
       ASA / Proof Records
             |
             v
       Asset & Audit Indexer
```

## 9.3 Backend Service Architecture

### Go (Golang) Core Services

Idiomatic Go layout (standard `cmd/` + `internal/` structure). Suggested frameworks: **Chi** or **Gin** for HTTP, **sqlc**/**pgx** for Postgres, **asynq** for Redis-backed queues.

```text
backend/
├── cmd/
│   └── api/                 # main entrypoint (API gateway)
├── internal/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── activities/
│   ├── evidence/
│   ├── verification/        # calls FastAPI AI services
│   ├── carbonaccounting/
│   ├── proofregistry/
│   ├── blockchain/          # Algorand SDK integration
│   ├── assets/
│   ├── marketplace/
│   ├── reporting/
│   ├── notifications/
│   ├── audit/
│   └── integrations/
├── pkg/                     # shared libraries
├── migrations/              # SQL migrations
└── common/                  # config, logging, middleware, errors
```

### FastAPI AI Services

```text
ai-services/
├── api/
├── image-classification/
├── waste-classification/
├── evidence-validation/
├── duplicate-detection/
├── anomaly-detection/
├── claim-assessment/
├── model-management/
├── evaluation/
└── shared/
```

AI services should be independently deployable and versioned.

## 9.4 Database Architecture

PostgreSQL will serve as the primary source of truth for application data.

Core tables:

| Table | Purpose |
|---|---|
| users | User information |
| organizations | Organization information |
| wallets | Blockchain wallet associations |
| activities | Sustainability activity records |
| activity_categories | Activity definitions |
| evidence | Uploaded evidence metadata |
| verification_results | AI and human verification |
| methodologies | Carbon methodologies |
| emission_factors | Calculation parameters |
| impact_assessments | Environmental impact |
| sustainability_proofs | Proof registry |
| blockchain_transactions | Transaction records |
| digital_assets | Asset metadata |
| asset_transfers | Ownership changes |
| asset_retirements | Retirement records |
| projects | Sustainability projects |
| audit_logs | Audit history |

### Important database constraints

- Unique proof IDs.
- Unique blockchain transaction IDs.
- Idempotent issuance requests.
- Unique evidence hashes within applicable deduplication scopes.
- Foreign-key relationships between activities, evidence and proofs.
- Versioned methodologies and emission factors.
- Immutable audit events.

# 10. API Specification

All APIs should use versioned routes:

`/api/v1/`

## 10.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /auth/register | Register user |
| POST | /auth/login | Login |
| POST | /auth/refresh | Refresh token |
| GET | /users/me | Current user |

## 10.2 Activities

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /activities | Create activity |
| GET | /activities | List activities |
| GET | /activities/:id | Activity details |
| PATCH | /activities/:id | Update draft |
| POST | /activities/:id/submit | Submit activity |

## 10.3 Evidence

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /evidence/upload | Upload evidence |
| GET | /evidence/:id | Evidence metadata |
| GET | /evidence/:id/status | Verification status |

## 10.4 AI Verification

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /ai/verify-image | Image assessment |
| POST | /ai/validate-evidence | Evidence assessment |
| POST | /ai/detect-duplicate | Duplicate detection |
| POST | /ai/assess-claim | Claim assessment |

## 10.5 Carbon Accounting

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /carbon/calculate | Calculate impact |
| GET | /carbon/impact/:id | Impact details |
| GET | /carbon/methodologies | List methodologies |

## 10.6 Proof Registry

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /proofs | Create proof |
| GET | /proofs/:id | Retrieve proof |
| GET | /proofs/:id/verify | Verify proof |
| GET | /proofs | List proofs |

## 10.7 Blockchain & Assets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /blockchain/anchor | Anchor proof |
| POST | /assets/issue | Request authorized issuance |
| GET | /assets/:id | Asset details |
| GET | /assets/:id/history | Asset history |
| POST | /assets/:id/retire | Initiate retirement |
| GET | /blockchain/transactions/:id | Transaction status |

All issuance, transfer and retirement endpoints must use authorization checks and idempotency keys.

# 11. End-to-End User Journey

## MVP: Recycling to Proof of Sustainability

**Step 1 — Registration**

User registers and associates a wallet.

**Step 2 — Activity Submission**

User selects recycling and enters the relevant activity details.

**Step 3 — Evidence Upload**

User uploads a photograph and supporting information.

**Step 4 — AI Assessment**

FastAPI evaluates the image and evidence.

**Step 5 — Verification**

The platform checks for duplicates and applies verification rules. Uncertain submissions are sent to human review.

**Step 6 — Carbon Accounting**

The accounting engine calculates an eligible environmental impact estimate using an approved calculation method.

**Step 7 — Proof Generation**

CarbonGero generates a unique Proof of Sustainability record.

**Step 8 — Blockchain Anchoring**

The proof reference is anchored to Algorand.

**Step 9 — Reward or Asset Issuance**

The user may receive an internal sustainability reward. A carbon-credit asset can only be issued when the underlying activity is eligible and all applicable project, methodology, verification and authorization requirements are satisfied.

**Step 10 — Dashboard**

User views the sustainability record, environmental impact and blockchain transaction reference.

# 12. Security, Privacy & Compliance

### Application security

- JWT-based authentication.
- Role-based access control.
- API rate limiting.
- Input validation.
- Secure file uploads.
- Encrypted data transmission.
- Secrets management.
- Audit logging.

### Blockchain security

- Secure signing-key management.
- Restricted administrative permissions.
- Transaction simulation and validation.
- Smart-contract security testing.
- Issuance authorization.
- Double-issuance prevention.
- Retirement tracking.

### Data protection

- Collect only necessary personal information.
- Separate private evidence from public proof metadata.
- Support data retention and deletion policies.
- Do not expose personal information through blockchain transactions.
- Maintain appropriate consent and access controls.

### Carbon market integrity

- Maintain methodology provenance.
- Record independent verification references.
- Track project ownership and issuance authority.
- Prevent double issuance and double claiming.
- Maintain retirement and ownership history.
- Distinguish voluntary platform rewards from recognized carbon credits.

The platform must not claim regulatory certification or registry accreditation without the required authorization.

# 13. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API availability | 99% initial target |
| API response time | P95 under 500 ms for ordinary reads |
| AI processing | P95 under 60 seconds for supported images |
| Scalability | Horizontally scalable services |
| Database consistency | Transactional integrity |
| Security | OWASP-aligned security controls |
| Observability | Centralized logs, metrics and traces |
| Recovery | Documented backup and recovery procedures |
| Idempotency | Required for financial and issuance operations |
| Auditability | Complete activity-to-proof traceability |

These are initial service-level engineering objectives and must be validated through load testing.

# 14. MVP Development Roadmap

## Phase 1 — Foundation

- Repository and project setup.
- Authentication.
- User and organization management.
- Activity management.
- Evidence upload.
- PostgreSQL schema.
- API gateway.

## Phase 2 — AI Verification

- Image classification.
- Waste classification.
- Evidence validation.
- Duplicate detection.
- Verification workflow.
- Human review interface.

## Phase 3 — Proof & Carbon Accounting

- Proof of Sustainability registry.
- Methodology management.
- Emission factor configuration.
- Carbon calculation engine.
- Proof verification APIs.
- Audit trail.

## Phase 4 — Algorand Integration

- Wallet integration.
- Testnet deployment.
- Proof anchoring.
- ASA issuance for authorized asset classes.
- Asset indexing.
- Transaction monitoring.

## Phase 5 — Product Experience

- Web dashboard.
- Mobile application.
- Activity history.
- Proof verification page.
- Sustainability rewards.
- Basic ESG reporting.

## Phase 6 — Expansion

- Project developer portal.
- Enterprise integrations.
- Marketplace.
- Advanced reporting.
- Third-party developer SDK.
- Additional sustainability activity categories.

# 15. Testing & Acceptance Criteria

### Functional testing

- Users can register and submit activities.
- Evidence uploads are securely stored.
- Duplicate evidence is detected.
- AI assessment results are traceable.
- Human reviewers can approve or reject activities.
- Carbon calculations reproduce from versioned inputs.
- Proof records are uniquely generated.
- Algorand transactions are indexed and verified.
- Asset issuance is restricted to authorized workflows.

### Security testing

- Authentication and authorization testing.
- API penetration testing.
- File-upload security testing.
- Smart-contract review.
- Wallet signing security.
- Duplicate transaction testing.
- Privilege escalation testing.

### MVP acceptance criteria

The MVP is considered complete when a user can:

1. Register.
2. Submit a recycling activity.
3. Upload evidence.
4. Receive an AI assessment.
5. Complete required verification.
6. Generate a Proof of Sustainability record.
7. Calculate a documented environmental impact estimate.
8. Anchor the proof reference on Algorand.
9. View the proof and its transaction reference.

The MVP must demonstrate the full evidence-to-proof workflow without representing an unverified activity as a certified carbon offset.

# 16. Open-Source Strategy

CarbonGero should be developed with an open-source-first infrastructure strategy.

Potential open-source components:

- Core proof registry.
- Sustainability activity APIs.
- Carbon accounting framework.
- Algorand integration SDK.
- Verification service interfaces.
- Developer documentation.
- Example sustainability applications.

Proprietary or controlled components may include:

- Enterprise dashboards.
- Advanced AI models.
- Managed verification services.
- Commercial integrations.
- Enterprise reporting and support.

The final repository structure and licensing strategy should be established before public release.

# 17. Business Model

| Revenue stream | Description |
|---|---|
| SaaS subscriptions | Enterprise sustainability management |
| Verification fees | Evidence and project verification services |
| API usage | Paid enterprise API access |
| Marketplace fees | Transaction facilitation fees |
| ESG reporting | Enterprise reporting subscriptions |
| Infrastructure licensing | Managed proof and blockchain infrastructure |

Revenue from carbon-credit transactions must be conditional on the relevant legal, registry and market requirements.

# 18. Explicitly Out of Scope for MVP

To prevent unnecessary engineering complexity, the following are excluded from the initial release:

- RWA lending and borrowing.
- Zero-knowledge proof infrastructure.
- Satellite-based verification.
- IoT and DePIN infrastructure.
- Complex cross-chain bridges.
- National carbon-market infrastructure.
- Autonomous AI issuance of carbon credits.
- Complex derivatives and carbon-credit financial products.

These may be evaluated separately after validating the core product.

# 19. Key Technical Decisions

| Decision | Selected approach |
|---|---|
| Product identity | CarbonGero |
| Original product | EcoCreds |
| Blockchain | Algorand |
| Token standard | Algorand Standard Assets |
| Core backend | Go (Golang) |
| AI backend | FastAPI |
| Database | PostgreSQL |
| Cache | Redis |
| Web | Next.js |
| Mobile | React Native / Expo |
| Proof model | Proof of Sustainability |
| Verification | AI-assisted + human review |
| Accounting | Methodology-driven calculation engine |
| Asset integrity | Issuance authorization + provenance + retirement |

# 20. Final Product Definition

CarbonGero is an open-source, AI-powered Proof of Sustainability infrastructure that enables individuals, businesses and sustainability projects to generate evidence-backed environmental records, calculate measurable impact, and create traceable digital environmental assets through Algorand.

Its core value proposition is not simply tokenizing carbon credits.

It is creating the infrastructure that connects:

**Real-world environmental action → Verifiable evidence → Measurable impact → Digital proof → Authorized asset issuance → Transparent environmental accounting.**

---

**Document ownership:** Product & Engineering
**Product:** CarbonGero
**Parent:** Xphora AI Technology Pvt. Ltd.
**Version:** 2.0
**Status:** Proposed baseline for engineering review.

---

# 21. Implementation Progress (as of 18 Nov 2026)

Deployed live at **https://xecocreds.vercel.app** — a monorepo (Next.js 16 frontend + Go serverless backend + Neon Postgres + Algorand TestNet) on Vercel. See `docs/BACKEND.md` for the wiring.

| Phase | Status | Done | Left to execute |
|---|---|---|---|
| **1 — Foundation** | 🟢 Mostly done | Monorepo, Postgres schema (users, activities, evidence, assessments, proofs), activity submission, evidence SHA-256, Go API gateway (`/api/health,submit,proofs,stats,wallet`) | **Real auth** (currently demo-only, single `USR-DEMO`), organisation management, email verification, RBAC/roles |
| **2 — AI Verification** | 🟡 Partial | Deterministic AI assessment stub (classification + confidence + recommended action); **human peer-review queue** now live (verifier approve/reject with on-chain attestation, `review_status` gate before credit issuance) | **FastAPI microservices**: image/waste classification, evidence validation, duplicate & anomaly detection (replace the stub); real verifier roles/RBAC |
| **3 — Proof & Carbon Accounting** | 🟢 Mostly done | Proof of Sustainability registry, seeded methodologies + emission factors, carbon engine (GHG: AD×EF×OF − leakage), proof APIs, basic audit fields | Methodology/emission-factor **admin UI**, versioning, full immutable audit log, proof public-verify endpoint |
| **4 — Algorand Integration** | 🟢 Mostly done | **Real TestNet anchoring** (go-algorand-sdk v2, note-field txn), **Pera/Lute wallet connect**, wallet persistence, **ASA reward issuance** (CGRO, config-gated + opt-in aware + graceful fallback), **asset indexer** (`/api/account` on-chain holdings), **client-side ASA opt-in** (algosdk + Pera), tx log (`blockchain_transactions`), explorer links — all config-gated | **Fund the TestNet treasury + create the CGRO ASA** → flip issuance live (2 env vars, no redeploy); **smart-contract controls** (programmatic issuance-authorization / freeze-clawback / retirement — PyTeal or Algorand Python, Phase 6) |
| **5 — Product Experience** | 🟡 Partial | Rich web dashboard (collapsible sidebar, dark mode, ApexCharts), submit-activity flow, proof registry, KPI detail pages (credits/score/impact), onboarding tour, rewards UI | **Mobile app** (React Native/Expo), **real ESG reporting** (corporate dashboards still use mock data), full activity history from DB |
| **6 — Expansion** | 🟡 Partial | **Carbon-credit certificates** (voluntary-market, issued only from human-APPROVED proofs; serial, project, vintage, methodology; certificate anchored on Algorand), **corporate exchange** (issue → list → buy → retire, full provenance via `credit_events`, on-chain event anchoring), **human peer-review verifier** queue (`/dashboard/verify`, on-chain attestation) | Payment settlement (USDC via licensed ramp — see off-ramp research; not in-house), ASA tokenization per credit, project-developer portal, enterprise integrations, advanced reporting, developer SDK, more activity categories |

### Beyond the PRD (already shipped)
- "Carbon Almanac" → official **CarbonGero design system** (Sora + Inter, lime/emerald/teal, light + dark), Next.js 16 + React 19 upgrade.
- Marketing landing matching the design mockup; auth pages with Pera wallet login; device favicons + PWA manifest.
- **SEO blog system**: 6 fact-based articles (CCTS, CBAM, MSME, circular economy, product use-case, India-vs-EU) with tables, Mermaid diagrams + real-data ApexCharts, JSON-LD, sitemap.

### Immediate next candidates
1. **Fund the Algorand TestNet treasury + create the CGRO reward ASA** → set
   `ALGORAND_MNEMONIC` + `ALGORAND_REWARD_ASA` to flip anchoring **and** reward
   issuance from simulated→live (no redeploy).
2. **Smart-contract layer (PyTeal / Algorand Python)** — only needed for
   *programmatic* on-chain logic: issuance-authorization app, rule-based
   retirement, marketplace escrow. ASA primitives (create/transfer/opt-in/
   freeze/clawback roles) already cover the reward + credit token mechanics
   without a contract.
3. **Real auth + organisations** (Phase 1 gap) — e.g. Clerk.
4. **FastAPI AI evidence service** to replace the stub (Phase 2).
