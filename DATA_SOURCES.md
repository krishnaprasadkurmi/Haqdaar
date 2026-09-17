# Data Sources and Attribution

This document details the provenance, source portals, and open data licensing for all government health scheme and empanelled hospital data used in **HaqDaar**, satisfying **Section 03** of the hackathon rulebook.

---

## 1. Empanelled Hospital Registry (Bihar & Karnataka)

- **Source**: National Health Authority (NHA), Ministry of Health & Family Welfare, Government of India.
- **Portal**: [PM-JAY Hospital Search Directory](https://hospitals.pmjay.gov.in/) & Open Government Data (OGD) Platform India ([data.gov.in](https://data.gov.in)).
- **Data Extracted**:
  - Facility Name, State, District, Complete Postal Address, Latitude/Longitude
  - Hospital Category (`Public (Apex / Autonomous / Medical College)` vs. `Private Empanelled`)
  - Empanelled Specialties (`Dialysis / Nephrology`, `Cardiology / CTVS`, `Maternity / Obstetrics`, `Medical & Surgical Oncology`)
  - In-hospital Ayushman Mitra Desk (PMAM) counter locations and direct helpline contacts.
- **License**: **National Data Sharing and Accessibility Policy (NDSAP) / Government Open Data License - India (GODL)**.
- **Local Artifacts**:
  - `data/hospitals.json`
  - `data/hospitals.csv`

---

## 2. Scheme Benefit Packages & Eligibility Rules

### A. Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)
- **Source**: National Health Authority (NHA) — Health Benefit Packages 2.2 (HBP 2.2) and Beneficiary Identification System guidelines.
- **Portal**: [pmjay.gov.in/about/pmjay](https://pmjay.gov.in/about/pmjay)
- **License**: Public Sector Information / Official Government Documentation.
- **Coverage**: ₹5,00,000 per family per year across secondary and tertiary hospitalization.

### B. Mukhyamantri Jan Arogya Yojana (MMJAY - Bihar)
- **Source**: Bihar Swasthya Suraksha Samiti (BSSS), Department of Health, Government of Bihar.
- **Portal**: [statehealthsocietybihar.org](https://statehealthsocietybihar.org)
- **License**: Public Information (State Govt Notifications).
- **Coverage**: ₹5,00,000 per family per year for NFSA ration cardholders in Bihar not present in SECC 2011.

### C. Ayushman Bharat - Arogya Karnataka (ArK)
- **Source**: Suvarna Arogya Suraksha Trust (SAST), Department of Health and Family Welfare, Government of Karnataka.
- **Portal**: [arogya.karnataka.gov.in](https://arogya.karnataka.gov.in)
- **License**: Public Information (Govt of Karnataka Health Trust).
- **Coverage**: Universal coverage with Category A (100% cashless up to ₹5 Lakh) and Category B (General - 30% financial assistance).

---

## 3. Synthetic vs. Real Fields Note

- **100% Real Fields**: Hospital names, physical addresses, geographic districts, facility classifications (Apex institute / GMC / Private Super-specialty), empanelment status, and official national/state helplines (`14555`, `104`).
- **Standardized/Synthesized Fields**: The exact counter descriptions for the hospital PMAM desk (e.g., *"Ayushman Mitra Counter, Ground Floor OPD Block A"*) are synthesized based on standard NHA hospital layout SOPs to provide actionable guidance for patients.
