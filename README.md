# HaqDaar — Conversational Health Scheme & Empanelled Hospital AI Navigator

> **"HaqDaar is a conversational agent that tells an Indian patient which government health scheme they qualify for, which nearby empanelled hospital treats their condition under it, and exactly what documents to carry — in one conversation, in plain language."**

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![AWS Bedrock](https://img.shields.io/badge/AWS-Amazon%20Bedrock%20Claude-indigo.svg)](https://aws.amazon.com/bedrock/)
[![Hackathon](https://img.shields.io/badge/WeMakeDevs-Bharat%20Builds%20Tour%202026-amber.svg)](https://wemakedevs.org)
[![Team](https://img.shields.io/badge/Team-NEXBYTE%20(FJS4C4)-blue.svg)](#team)

---

## The problem
Over 55 crore underprivileged Indian citizens are eligible for free secondary and tertiary healthcare under Ayushman Bharat PM-JAY and state health schemes. However, during acute medical emergencies or chronic illnesses (like kidney dialysis or cardiac surgery), families lack clarity on which government scheme they qualify for, which nearby empanelled hospital actually offers their required specialty without out-of-pocket extortion, and what exact documents to carry to the Ayushman Mitra counter. Consequently, vulnerable families either borrow at catastrophic interest rates or get turned away due to missing paperwork.

---

## Who it's for
- **Patients and low-income families** navigating government health coverage in **Bihar** and **Karnataka**.
- **ASHA workers, Anganwadi coordinators, and hospital help desks** guiding illiterate or distressed patients to empanelled facilities and scheme help desks.

---

## What we built
HaqDaar is a multi-step agentic AI assistant built on Amazon Bedrock. In a single plain-language conversation:
1. **Identifies Eligible Schemes**: Analyzes the family's state and ration card status (BPL, Antyodaya AAY, Priority Household PHH, or General) and returns matching national (PM-JAY) and state schemes (Bihar MMJAY, Karnataka ArK) with coverage up to ₹5,00,000/year.
2. **Empanelled Hospital Matching**: Pinpoints verified public and private empanelled hospitals with verified capacity in their district that treat their specific medical condition.
3. **Actionable Document Checklist**: Generates the exact point-of-care document list (Aadhaar, Ration Card / Golden Card, Doctor's referral slip) with clear instructions on locating the hospital's **Pradhan Mantri Arogya Mitra (PMAM)** counter.
4. **Scope Boundary**: **Navigational only**. Strictly no medical diagnosis, no treatment advice, and no symptom triage. A persistent compliance disclaimer is displayed on every screen:
   > *"Informational guidance only. HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or the scheme helpline (PM-JAY: 14555) before acting."*

---

## Demo flow
The 2:40 unedited demonstration follows the canonical user scenario:
- **Scenario**: A family in Patna, Bihar has a father requiring urgent maintenance hemodialysis. The family holds a BPL ration card.
- **Query Input**: *"My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?"*
- **Agent Tool Execution Trace**: The UI displays the live agent decision trace:
  1. `find_schemes({ state: "Bihar", income_category: "BPL", condition: "Dialysis" })` -> Returns PM-JAY & MMJAY coverage.
  2. `find_hospitals({ state: "Bihar", district: "Patna", condition: "Dialysis", scheme: "PM-JAY" })` -> Returns AIIMS Patna, IGIMS, and Paras HMRI.
  3. `list_documents({ scheme: "PM-JAY", condition: "Dialysis", income_category: "BPL" })` -> Generates checklist with PMAM desk steps.
- **Output Cards**: The patient receives the ₹5 Lakh cashless scheme confirmation, the exact hospital addresses with PMAM room locations, and the interactive document checklist.

---

## Where AWS fits
- **Amazon Bedrock (Claude 3.5 Sonnet)**: Core reasoning foundation model evaluating user situation, enforcing the strict navigational guardrail, and driving the autonomous agent loop.
- **Strands Agents SDK**: Orchestrates the multi-turn agent tool-calling execution graph across `find_schemes()`, `find_hospitals()`, and `list_documents()`.
- **Amazon DynamoDB**: Low-latency NoSQL structured tables (`haqdaar-hospitals`, `haqdaar-schemes`) for real-time querying of verified empanelled centers, beds, and package codes.
- **Amazon S3**: Secure object store for official PM-JAY hospital empanelment CSV datasets and state health scheme benefit package PDFs.
- **AWS Lambda + API Gateway**: Serverless microservices routing agent requests and executing backend tools without idle operational overhead.
- **AWS CloudWatch**: Real-time distributed tracing, invocation latency logs, token count tracking, and guardrail audit logging shown live on camera.

---

## AI coding tools used
*(Required by Section 03 of Hackathon Rulebook)*
- **Antigravity / Gemini 3.8 Flash (High)**
- **Claude Code**
- **Cursor**
- **GitHub Copilot**

---

## Data sources and licences
*(Required by Section 03 of Hackathon Rulebook)*
- **National Health Authority (NHA) PM-JAY Empanelled Hospital Registry**: [hospitals.pmjay.gov.in](https://hospitals.pmjay.gov.in) — licensed under **Government Open Data License - India (GODL)**.
- **Ayushman Bharat Health Benefit Packages 2.2 (HBP 2.2)**: Official public documentation, National Health Authority.
- **Bihar Swasthya Suraksha Samiti (BSSS) & MMJAY**: [statehealthsocietybihar.org](https://statehealthsocietybihar.org) — official public notifications.
- **Arogya Karnataka (ArK) / Suvarna Arogya Suraksha Trust**: [arogya.karnataka.gov.in](https://arogya.karnataka.gov.in) — official public guidelines.
*(Detailed provenance and fields are documented in [DATA_SOURCES.md](DATA_SOURCES.md)).*

---

## Third-party code and credits
- **React 19** (MIT License)
- **Vite 6** (MIT License)
- **Lucide React** (ISC License)
- **Tailwind-free Custom Design System** (Vanilla CSS Variables & Glassmorphism)

---

## Limitations
- **Two States Only**: Currently scoped to public empanelment data for Bihar and Karnataka.
- **Four Medical Specialties**: Dialysis (Nephrology), Cardiac Care, Institutional Maternity, and Oncology.
- **Indicative Guidance**: Eligibility is indicative based on self-reported ration category; final biometric e-KYC authentication occurs at the hospital PMAM counter.

---

## What production would need
1. Live bidirectional API integration with the National Health Authority (NHA) Beneficiary Identification System (BIS) and Transaction Management System (TMS).
2. Direct real-time bed availability integration with state hospital dashboards.
3. Multilingual voice interface supporting Hindi, Maithili, Bhojpuri, Kannada, and Urdu for rural non-literate beneficiaries.
4. WhatsApp / SMS bot integration via AWS Pinpoint for offline slip delivery.

---

## Team
**Team NEXBYTE** (Code: `FJS4C4`)

| Name | Role | University | Graduation Year |
| :--- | :--- | :--- | :--- |
| **Krishna** | Team Leader & Fullstack / AWS Agent Architecture | RV College of Engineering | **2027** (Final Year) |
| **Member 2** | Data Pipeline & DynamoDB Schemas | BMS College of Engineering | **2027** (Final Year) |
| **Member 3** | Frontend & UI/UX Design System | PES University | **2028** (Pre-Final Year) |
| **Member 4** | AWS CloudWatch Tracing & Testing | Ramaiah Institute of Technology | **2028** (Pre-Final Year) |

*(Graduation years included per Section 06 for Amazon fast-track interview verification).*

---

## Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/nexbyte/haqdaar.git
cd haqdaar

# Install dependencies
npm install

# Run agent unit tests
node test/agentTools.test.js

# Start local development server
npm run dev

# Build production bundle
npm run build
```
