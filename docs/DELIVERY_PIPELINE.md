# AMP Delivery Pipeline

## 1) Cloud Run Intake
- `ampIntake` receives validated intake payloads.
- Routing selects modules and returns structured results.

## 2) Async Report Job
- Background job assembles report JSON from intake, plan, and module results.
- Job renders report HTML and prepares client delivery artifacts.

## 3) Vertex Verification
- Verification layer runs a Gemini-based check (currently stubbed).
- Output includes status, notes, risk flags, and check timestamp.

## 4) GCS Storage
- Rendered reports are uploaded to cloud storage (currently stubbed).
- Production design should provide signed URLs for controlled access.

## 5) SendGrid Transactional Email
- Delivery service sends report email with report link (currently stubbed).
- Production setup uses API key + sender identity from environment variables.

## 6) Executive Chatbot
- Executive tier enables a 7-day report-grounded assistant.
- Chatbot responses should use report contents and linked evidence as primary context.
