# HaqDaar — 2:40 Demo Video Narration Script

**Hard Ceiling**: 3:00 minutes | **Target Runtime**: 2:40 minutes  
**Format**: YouTube unlisted / public, unedited live recording with screen share.  
**Team**: NEXBYTE (Code: FJS4C4, Leader: Krishna)

---

## Shot-by-Shot Video Script

### 0:00 – 0:20 | Title Card & The Problem
- **On Screen**: Clean title card showing *"HaqDaar: Haq Se Sehat Tak"* and key statistic: *"55+ Crore Indians covered by Ayushman Bharat, yet thousands pay out-of-pocket during emergencies."*
- **Narrator (Spoken)**:
  > *"Over 55 crore citizens in India are covered by government health schemes like Ayushman Bharat, but during a medical emergency, families don't know which scheme they qualify for, which hospital treats them cashless, or what documents to carry. Today, we built HaqDaar to solve this in one plain-language conversation."*

---

### 0:20 – 0:35 | Product Landing Screen & Scope Boundary
- **On Screen**: HaqDaar web application home screen. Point out the top banner: *"Informational guidance only. HaqDaar does not provide medical advice or confirm eligibility. Always verify with the hospital or scheme helpline (14555)."*
- **Narrator (Spoken)**:
  > *"HaqDaar is an agentic AI assistant built on AWS Bedrock. Crucially, it is navigational, not diagnostic. We have hard guardrails preventing symptom triage or medical advice. It simply navigates patients to their rightful government benefits."*

---

### 0:35 – 1:45 | Live Demo (Unedited) — Dialysis, Bihar, BPL
- **On Screen**:
  1. Click the preset scenario chip: **"Dialysis in Bihar (Patna · BPL)"** or type:
     *"My father needs maintenance dialysis in Patna, Bihar. We hold a BPL ration card. Which empanelled hospital provides cashless treatment and what documents are needed?"*
  2. Click **Run Agent**.
  3. Zoom in on the **Bedrock Agentic Loop Trace** box:
     - Show Step 1: Evaluating navigational guardrail.
     - Show Step 2: Agent calling `find_schemes({ state: "Bihar", income_category: "BPL", condition: "Dialysis" })`. Click **Inspect JSON** to reveal DynamoDB query returns.
     - Show Step 3: Agent calling `find_hospitals({ state: "Bihar", district: "Patna", condition: "Dialysis" })`.
     - Show Step 4: Agent calling `list_documents()`.
  4. Scroll down to show the generated results:
     - Scheme Card: Ayushman Bharat PM-JAY (₹5,00,000 / year cashless).
     - Hospital Cards: AIIMS Patna, IGIMS, and Paras HMRI, showing distance and the **Ayushman Mitra (PMAM) counter location**.
     - Interactive Document Checklist: Aadhaar, BPL Ration card, doctor's prescription.
- **Narrator (Spoken)**:
  > *"Let's run a real scenario: a family in Patna, Bihar needing kidney dialysis with a BPL card. Notice our visible agent trace in real-time. This is not a chatbot wrapper with a prompt. The agent reasons, determines the patient's state and condition, and invokes `find_schemes` against DynamoDB. Next, it invokes `find_hospitals` to locate AIIMS Patna, IGIMS, and Paras HMRI. Finally, it calls `list_documents` to prepare the exact checklist for the Ayushman Mitra counter at the hospital entrance."*

---

### 1:45 – 2:20 | AWS Proof (Console, Architecture & Logs)
- **On Screen**:
  1. Click the top navbar button: **"AWS Console & Proof"**.
  2. Tab 1 (**Architecture Diagram**): Show Amazon Bedrock Claude 3.5 Sonnet, Strands Agent SDK, DynamoDB tables, S3, and CloudWatch.
  3. Tab 2 (**Live CloudWatch Logs**): Show the real-time log stream. Highlight the log line with the exact Request ID, `BEDROCK_INVOCATION_COMPLETE`, latency (`~780ms`), and token counts from the query just executed.
  4. Tab 3 (**DynamoDB Tables**): Toggle between `haqdaar-hospitals` and `haqdaar-schemes`, showing real empanelment records.
- **Narrator (Spoken)**:
  > *"Here is where AWS powers HaqDaar. Our agent reasoning runs on Amazon Bedrock Claude 3.5 Sonnet. Low-latency hospital lookups run on Amazon DynamoDB tables—here are the real records in `haqdaar-hospitals`. In Amazon CloudWatch, you can see the live log line from the query we just ran, complete with AWS Request ID, token usage, and tool latency metrics in ap-south-1."*

---

### 2:20 – 2:40 | Limitations, Team, and Disclaimer
- **On Screen**: Footer showing Team NEXBYTE, Leader: Krishna, Code: FJS4C4, and public repository URL.
- **Narrator (Spoken)**:
  > *"HaqDaar currently covers public empanelment data for Bihar and Karnataka across four core conditions. In production, we plan live integration with the NHA BIS API and Indian voice interfaces. We are Team NEXBYTE: Krishna, and our members from Bangalore. Thank you."*

---

## Recording Checklist
- [ ] Pre-load all browser tabs and ensure local/deployed server is running smoothly.
- [ ] Test query input once before recording take.
- [ ] No background music over voice narration.
- [ ] Keep total video length between **2:30 and 2:45**.
- [ ] Verify YouTube upload is set to **Unlisted** or **Public** (Never Private).
