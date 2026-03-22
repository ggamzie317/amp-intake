# AMP Report Template Skeleton v1

## Purpose

This template defines the MVP report-level contract for assembler-facing outputs. It gives AMP reports a stable section order while keeping delivery and rendering flexible.

## MVP Section Order

1. Executive Summary
2. Recommendation
3. Fare / Points Comparison
4. Assumptions
5. Evidence
6. Next Action

Canonical sample output key order for both Basic and Premium:
`executive_summary` -> `recommendation` -> `fare_points_comparison` -> `assumptions` -> `evidence` -> `next_action`

### Lightweight Type Expectations (Non-Formal)

This is a practical reference for sample outputs, not a formal schema definition.
`executive_summary`: object, `recommendation`: object, `fare_points_comparison`: object, `assumptions`: array of strings, `evidence`: array of objects, `next_action`: object.

## JSON-Style Output Shape

```json
{
  "executive_summary": {
    "headline": "Short outcome statement",
    "context": "Why this case matters now"
  },
  "recommendation": {
    "primary_action": "Best current path",
    "reason": "Short justification"
  },
  "fare_points_comparison": {
    "cash_option": {},
    "points_option": {},
    "tradeoff_note": "Concise comparison"
  },
  "assumptions": [
    "Input assumption 1",
    "Input assumption 2"
  ],
  "evidence": [
    {
      "title": "Source label",
      "url": "https://example.com/source",
      "source_type": "official",
      "as_of": "2026-03-05",
      "placeholder": true
    }
  ],
  "next_action": {
    "step": "Immediate next move",
    "owner": "Client"
  }
}
```

## Tier-Aware Inclusion

Basic can expose only the essential sections with shorter explanations. Premium can later keep the same section order but expand detail depth, comparisons, and supporting notes.

Keep the same top-level keys for Basic and Premium.
Tier differences should appear in detail depth, comparison richness, and evidence density.
Avoid introducing separate report shapes per tier unless later requirements make that unavoidable.

### Tier Delta Rule

Treat Basic and Premium as one shared output contract.
Premium should increase depth and decision support detail (including richer evidence), not replace the top-level schema.
AMP borrows AMC-style output contract discipline to reduce drift, implementation mistakes, and schema divergence.
AMP should remain shorter and more execution-oriented than AMC, with fewer sections and lighter narrative density.

## Evidence Placement

Evidence should appear in the dedicated `evidence` section and may also be referenced inline by other sections when needed. Evidence is placeholder-ready today and can later evolve into richer link-based evidence objects.

## Sample Output Naming

Use a simple, stable naming convention for future examples:

- `sample-report-basic-v1.json`
- `sample-report-premium-v1.json`
- `sample-report-one-way-air-v1.json`
