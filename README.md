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
- Report template skeleton: [docs/report-template-v1.md](docs/report-template-v1.md)
- 70/70 tests passing
- Stable tag: v1.1-assembler-stable

## Working Intake Example (MVP)

```json
{
  "meta": {
    "caseId": "AMP-MVP-001",
    "tier": "essential",
    "createdAt": "2026-03-05T09:00:00.000Z",
    "locale": "en-US",
    "currency": "USD",
    "source": "web"
  },
  "routing": {
    "primaryGoal": "travel_air",
    "scenario": "one_way",
    "urgency": "normal"
  },
  "domain": {
    "programs": {
      "sourceProgram": "DEFAULT-CARD",
      "entries": [
        {
          "category": "card",
          "brandRaw": "Amex MR",
          "question": "transfer options?"
        },
        {
          "category": "hotel",
          "brandRaw": "Marriott Bonvoy",
          "question": "Tokyo redemption?"
        }
      ]
    },
    "balances": {
      "pointBalance": 0,
      "mileBalance": 0
    },
    "pricing": {
      "transferRatio": 1.0
    }
  },
  "policy": {
    "complianceFlags": {
      "isPublicOfficial": false,
      "isMilitary": false,
      "isCorporateTrip": false,
      "usesCorporateCard": false
    }
  }
}
```

- `meta.tier` is optional and must be one of `essential`, `strategic`, or `executive`.
- `domain.programs.entries` is optional, allows mixed `air` / `hotel` / `card` categories, and is limited to 2 typed objects.
- `domain.programs.sourceProgram` remains required even when `entries` is present.
