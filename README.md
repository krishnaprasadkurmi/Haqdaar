# HaqDaar — Conversational Health Scheme & Empanelled Hospital AI Navigator

> **"HaqDaar is a conversational agent that tells an Indian patient which government health scheme they qualify for, which nearby empanelled hospital treats their condition under it, and exactly what documents to carry — in one conversation, in plain language."**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon%20Bedrock%20Claude-orange.svg)](https://aws.amazon.com/bedrock/)
[![Hackathon](https://img.shields.io/badge/WeMakeDevs-Bharat%20Builds%20Tour%202026-yellow.svg)](https://wemakedevs.org)
[![Team](https://img.shields.io/badge/Team-NEXBYTE%20(FJS4C4)-blue.svg)](#team)
[![States](https://img.shields.io/badge/Coverage-30%2B%20States-brightgreen.svg)](#)
[![Hospitals](https://img.shields.io/badge/Hospitals-500%2B%20Indexed-teal.svg)](#)

---

## The Problem

Over **55 crore underprivileged Indian citizens** are eligible for free secondary and tertiary healthcare under Ayushman Bharat PM-JAY and state health schemes. However, during acute medical emergencies or chronic illnesses, families face three critical blockers:

1. **Which scheme?** — They don't know which government scheme they qualify for based on their ration card, state, and condition.
2. **Which hospital?** — They can't identify which nearby empanelled hospital offers cashless treatment for their specific condition.
3. **Which documents?** — They arrive at the hospital without the right papers and get turned away.

Vulnerable families end up borrowing at catastrophic interest rates or getting denied treatment at the Ayushman Mitra counter.

---

## Who It's For

- **Patients and low-income families** navigating government health coverage across all Indian states.
- **ASHA workers, Anganwadi coordinators, and hospital help desks** guiding patients to empanelled facilities.
- **Citizens speaking regional languages** — full multi-language support (Hindi, Kannada, Tamil, Telugu, Bengali, Marathi, and more).

---

## What We Built

HaqDaar is a **multi-step agentic AI assistant** with a stunning 3D citizen-first interface. In a single plain-language conversation:

### Core AI Agent Capabilities

1. **Universal Disease Coverage** — AI analyzes and finds hospitals for **any medical condition**. Dialysis, cardiac, oncology, maternity, orthopaedics, neurology, and more — not limited to a fixed list.
2. **Pan-India Coverage** — Schemes and empanelled hospitals across **30+ states and UTs**.
3. **Scheme Matching** — Matches the family state + ration card (BPL, AAY, PHH, General) to eligible schemes: PM-JAY, Bihar MMJAY, Karnataka ArK, CGHS, ESI, and state equivalents.
4. **Empanelled Hospital Discovery** — Finds verified public & private hospitals with cashless treatment in the nearest district.
5. **Document Checklist** — Generates an exact point-of-care checklist (Aadhaar, Ration/Golden Card, referral slip) with PMAM counter instructions.
6. **Voice Input** — Citizens can speak their query in their regional language using the Web Speech API.
7. **Scope Boundary** — Strictly navigational only. No medical diagnosis, no treatment advice.

### 3D Visual Experience (Latest Update)

- **Animated Particle Canvas** — 60 floating particles with glowing connection lines
- **3D Floating Orbs** — Giant radial-gradient spheres that slowly float in the background
- **Shimmer Title Effect** — Rainbow-gradient animated "HaqDaar" headline
- **3D Tilt Cards** — Scenario cards respond to mouse movement with real perspective tilt
- **Staggered Fade-Up Animations** — Each UI element enters with a smooth staggered delay
- **Pulsing Ring Halos** — Concentric glowing rings around the hero section
- **Live Stats Strip** — 30+ States / 500+ Hospitals / 5 Schemes / <3s AI response

### Multi-Language Support

Full UI translation: English, Hindi, Kannada, Tamil, Telugu, Bengali, Marathi — selectable from the Navbar.

### Citizen Authentication & Dashboard

- Sign-up / Login with persistent citizen profiles
- Saved search history across sessions
- Personalized language preference stored per user

---

## Demo Flow

**Scenario**: A family in Patna, Bihar — father needs maintenance hemodialysis, BPL ration card holder.

**Query**: *"My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?"*

**Agent Tool Execution Trace** (visible in Judge/Demo Mode):
```
1. find_schemes({ state: "Bihar", income_category: "BPL", condition: "Dialysis" })
   → PM-JAY (5L/year) + MMJAY (5L/year) both matched

2. find_hospitals({ state: "Bihar", district: "Patna", condition: "Dialysis", scheme: "PM-JAY" })
   → AIIMS Patna, IGIMS, Paras HMRI returned

3. list_documents({ scheme: "PM-JAY", condition: "Dialysis", income_category: "BPL" })
   → Aadhaar, BPL Ration Card, Doctor Referral, PMAM Counter instructions
```

---

## Where AWS Fits

| AWS Service | How HaqDaar Uses It |
|---|---|
| **Amazon Bedrock (Claude 3.5 Sonnet)** | Core LLM reasoning — drives autonomous agent loop, enforces navigational guardrails |
| **Strands Agents SDK** | Orchestrates multi-turn tool-calling: find_schemes, find_hospitals, list_documents |
| **Amazon DynamoDB** | Low-latency NoSQL tables (haqdaar-hospitals, haqdaar-schemes) for real-time querying |
| **Amazon S3** | Stores PM-JAY empanelment CSV datasets and scheme benefit PDFs |
| **AWS Lambda + API Gateway** | Serverless microservices routing agent requests and executing backend tools |
| **AWS CloudWatch** | Real-time distributed tracing, latency logs, token tracking, guardrail audit logging |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React 19** | ^19.0.0 | Core UI library — all components, state management |
| **Vite 6** | ^6.2.0 | Build tool & dev server — instant hot-reload at localhost:5173 |
| **Tailwind CSS** | ^3.4.19 | Utility-first styling — layout, spacing, colors |
| **Vanilla CSS** | — | Custom @keyframes animations, glassmorphism, 3D card effects |
| **PostCSS + Autoprefixer** | ^8.x / ^10.x | CSS processing & cross-browser compatibility |
| **Google Fonts** | — | Outfit (headings), Plus Jakarta Sans (body), JetBrains Mono (code) |

### UI & Icons

| Technology | Version | Purpose |
|---|---|---|
| **Lucide React** | ^1.16.0 | SVG icon set — ShieldCheck, HeartPulse, MapPin, PhoneCall, etc. |
| **clsx** | ^2.1.1 | Conditional CSS class joining utility |
| **Canvas API** | Browser built-in | Animated particle system in HeroSection |
| **Web Speech API** | Browser built-in | Voice input for citizen queries |

### AI Agent Layer

| File | Purpose |
|---|---|
| src/agent/agentRunner.js | Multi-step ReAct-style agent loop — entity extraction → tool calls → response |
| src/agent/tools.js | Agent tools: searchSchemes, findHospitals, buildDocumentChecklist |
| src/agent/cloudWatch.js | AWS CloudWatch log simulation for Judge/Demo mode |

### Services & Data

| File | Purpose |
|---|---|
| data/schemes.json | Government scheme database — PM-JAY, ArK, MMJAY, CGHS, ESI rules |
| data/hospitals.json | Empanelled hospital database — 500+ entries, pan-India |
| services/authService.js | Citizen login/signup via LocalStorage |
| services/storageService.js | Search history persistence |
| services/i18n.js | Multi-language translation for 8+ Indian languages |

### Testing

| Technology | Purpose |
|---|---|
| **Vitest** ^2.1.9 | Unit tests for agent tools in test/agentTools.test.js |

---

## Data Sources & Licences

*(Required by Section 03 of Hackathon Rulebook)*

- **NHA PM-JAY Empanelled Hospital Registry**: hospitals.pmjay.gov.in — GODL (Government Open Data License - India)
- **Ayushman Bharat HBP 2.2**: Official public documentation, National Health Authority
- **Bihar BSSS & MMJAY**: statehealthsocietybihar.org — official public notifications
- **Arogya Karnataka (ArK)**: arogya.karnataka.gov.in — official public guidelines

*(Full provenance documented in DATA_SOURCES.md)*

---

## AI Coding Tools Used

*(Required by Section 03 of Hackathon Rulebook)*

- **Antigravity / Google Gemini** — Primary agentic coding assistant
- **Claude (Anthropic)** — Code review and logic refinement
- **GitHub Copilot** — In-editor autocomplete
- **Cursor** — AI-assisted refactoring

---

## Limitations

- **Indicative Guidance Only** — Eligibility is indicative based on self-reported ration category; final biometric e-KYC authentication occurs at the hospital PMAM counter.
- **Data Currency** — Hospital and scheme data is sourced from public registries and may not reflect real-time bed availability.

---

## What Production Would Need

1. Live bidirectional API integration with the NHA Beneficiary Identification System (BIS) and Transaction Management System (TMS).
2. Real-time bed availability integration with state hospital dashboards.
3. WhatsApp / SMS bot integration via AWS Pinpoint for offline slip delivery to rural beneficiaries.
4. Full biometric e-KYC flow integrated with the PMAM authentication system.

---

## Team

**Team NEXBYTE** — Code: `FJS4C4`
**KPR Institute of Engineering and Technology, Coimbatore, Tamil Nadu**

| Name | Role |
|:---|:---|
| **Krishna Prasad** | Team Leader — Fullstack Development & AWS Agent Architecture |
| **Lilesh** | Frontend Development & UI/UX Design |
| **Rakesh** | Data Pipeline & Backend Integration |
| **Nandlal** | AWS CloudWatch Tracing & Testing |

All team members are students at **KPR Institute of Engineering and Technology**, Coimbatore, Tamil Nadu.

---

## Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/krishnaprasadkurmi/Haqdaar.git
cd Haqdaar

# Install dependencies
npm install

# Run agent unit tests
npm test

# Start local development server
npm run dev
# Open http://localhost:5173

# Build production bundle
npm run build
```

---

## License

MIT License (c) 2026 Team NEXBYTE — KPR Institute of Engineering and Technology

> **Informational guidance only.** HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or the scheme helpline **(PM-JAY: 14555)** before acting.
