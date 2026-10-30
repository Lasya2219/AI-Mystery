# AI Mystery Room — Product & Technical Specification

This is the project’s implementation source of truth. The original, complete specification is preserved at [`../spec.md`](../spec.md); see it for all product, security, quality, and acceptance requirements. This build follows its MERN/TypeScript architecture, Gemini backend integration, spoiler-safe DTO contract, single final accusation, accessibility requirements, and phased plan.

## Implementation notes
- Anonymous playthroughs use a high-entropy bearer token; the database stores only its SHA-256 hash.
- MongoDB persistence is used when `MONGODB_URI` is configured and available. An in-memory store supports local UI/demo use when MongoDB is unavailable; that data lasts only until server restart.
- A deterministic fictional demo case is used if `GEMINI_API_KEY` is absent. It follows the same validation and private-solution serialization boundary as generated cases.
- Generated image assets are optional. Evidence remains playable through readable text and designed placeholders.
- Production startup requires MongoDB, Gemini, and an explicit frontend origin; local development can still use the in-memory demo fallback.
