## Module Result Contract (v1)

All module handlers must return:

{
  status: string,
  message?: string,
  timestamp: string,
  meta?: {
    implemented: boolean,
    simulation?: boolean
  }
}
---

## AMP Architecture Snapshot (v1.1-assembler-stable)

Flow:
Intake (HTTP)
→ Schema Validation (Ajv)
→ Pattern Resolution (PATTERNS)
→ Module Execution (handlers/*)
→ Report Assembly (report/assembler.js)

Key Features:
- Tier-aware report assembly (Essential / Strategic / Executive)
- Max 2 program analysis limit
- Evidence / Confidence / Verification layer included
- 70/70 tests passing
- Stable tag: v1.1-assembler-stable


