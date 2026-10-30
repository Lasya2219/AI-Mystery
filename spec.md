AI Mystery Room --- Product & Technical Specification
Document type: Single source of truth for spec-driven development
Version: 1.0
Status: Initial build specification
Product name: AI Mystery Room
Primary stack: MERN (MongoDB, Express.js, React, Node.js)
AI provider: Google Gemini API

1. Purpose and Product Summary
AI Mystery Room is a web application where a user submits a short
scenario, premise, or story idea. The application uses Google Gemini on
the backend to generate a fictional investigation. The investigation
contains a coherent mystery, a culprit, suspects, a timeline, and a
collection of fictional evidence such as chat messages, images, and
CCTV-style recordings or transcripts.

The user examines the case file, reviews evidence, forms a theory, and
selects the person they believe is responsible. The app then reveals
whether the choice is correct and explains the solution using evidence
already shown in the case.

Core product promise: Every generated case should be solvable from
the evidence presented, internally consistent, and entertaining. The AI
must not change the culprit or facts after the case is created.

1.1 Product goals
Turn a user-provided story premise into a playable mystery
investigation.
Generate fictional suspects, evidence, timelines, and a
deterministic solution.
Present evidence in a polished investigation-room interface.
Let the user submit one final culprit selection and receive an
evidence-based explanation.
Save cases and their progress in MongoDB when persistence is
enabled.
Keep Gemini credentials and all privileged AI calls on the backend.
1.2 Non-goals for the first release
Real police investigations or advice for real criminal cases.
Real-world identity verification, facial recognition, or identifying
actual people.
Uploading arbitrary user files as evidence.
Multiplayer, live co-op, leaderboards, payments, or subscriptions.
Generating unrestricted playable video files. The initial release
may use generated still images, CCTV-style frames, and text-based
camera logs/transcripts instead.
A general-purpose chatbot unrelated to the active case.
2. Target Users and Main User Journey
2.1 Target user
A casual player who enjoys detective stories, escape rooms, deduction
games, and interactive fiction. The experience should be understandable
without technical knowledge.

2.2 Main flow
User opens the landing page.
User enters a short story premise and selects optional difficulty,
tone, and evidence preferences.
Frontend validates the input and submits a create-case request to
the backend.
Backend asks Gemini to generate a structured case, validates the
result, and stores the canonical case.
User enters the investigation workspace and sees the case briefing,
suspects, timeline, and evidence board.
User opens evidence items, compares facts, and optionally takes
private notes.
User selects one suspect as the culprit and submits a final
accusation.
Backend checks the selected suspect against the stored solution and
returns the verdict and explanation.
User sees a results screen with correct/incorrect status, the actual
culprit, the reasoning, and a replay/new-case action.
2.3 User states
draft: user is editing the premise; no case exists yet.
generating: backend is creating and validating the case.
ready: case is generated and available to investigate.
submitted: user has made a final accusation.
revealed: the solution and explanation are visible.
failed: case generation failed after permitted retries; user can
retry.
A case's canonical solution must remain hidden from the client until the
user submits an accusation.

3. Functional Requirements
FR-01 --- Landing page
Explain the concept in one concise headline and supporting
paragraph.
Provide a prominent "Create a Mystery" call to action.
Show a short three-step explanation: create a premise, investigate
evidence, reveal the culprit.
Include sample scenario prompts users can select to populate the
premise field.
Provide loading, error, and empty states.
FR-02 --- Create a mystery
Required field: premise/story, trimmed length 30--1,000 characters.
Optional difficulty: easy, medium, hard; default medium.
Optional tone: classic_detective, thriller, campus_mystery,
locked_room, lighthearted; default classic_detective.
Optional evidence preferences: one or more of chat, image,
cctv, documents, timeline; if omitted, the system chooses a
balanced mix.
User must be warned that all characters and evidence are fictional.
Disable repeated submissions while generation is in progress.
Show a clear progress state, but do not fabricate exact generation
percentages.
If generation fails, show a human-readable message and a retry
action.
FR-03 --- AI case generation
Gemini must generate a complete case as structured JSON, not a free-form
story. The backend must validate the response against a schema before
storing it.

Every case must include: - Unique case ID. - Case title and short
summary. - Premise adapted from the user's input. - Difficulty and
tone. - Incident description: what happened, where, and when. - Between
3 and 5 suspects. - Exactly one canonical culprit, identified by suspect
ID. - Between 5 and 9 evidence items. - A coherent event timeline with
at least 4 events. - A set of facts, clues, red herrings, and
contradictions. - A solution explanation that references evidence IDs. -
A final reveal narrative. - Optional generated image asset metadata for
evidence types that support images. - A generation/schema version for
future compatibility.

FR-04 --- Investigation workspace
Display case title, summary, incident details, and difficulty.
Display suspects as cards with names, roles, motives, and alibis. Do
not reveal the culprit through visual styling or ordering.
Display evidence in an evidence board/grid with type labels, short
descriptions, and timestamps where relevant.
Allow opening evidence in a detail panel/modal.
Support evidence types:
chat: fictional message transcript with sender,
recipient/group, timestamps, and message text.
image: generated fictional scene/evidence image with caption,
time, and contextual description.
cctv: camera log with timestamped observations and optionally
a generated still frame. For v1, a transcript or storyboard is
sufficient; do not claim a real video exists when only
text/stills are provided.
document: fictional receipt, note, access log, report, or
similar document rendered as readable text.
timeline: event or location record.
Include a case timeline.
Include a private notes area stored with the user's case progress if
persistence is enabled. Notes must not be sent to Gemini unless
explicitly required by a future feature.
Make evidence review possible on mobile and desktop.
Provide a clear "Make an Accusation" action.
FR-05 --- Accusation
User must select exactly one suspect.
Confirmation step: "Submit your accusation? You will see the
solution afterward."
The accusation is final for the current playthrough. A new attempt
requires restarting/replaying the case; do not allow changing the
answer after reveal.
Send only the case ID and selected suspect ID to the backend.
The backend compares the selected suspect ID with the canonical
culprit ID stored in MongoDB.
Do not ask Gemini to decide whether the answer is correct. The
stored canonical solution is authoritative.
FR-06 --- Results and reveal
Display correct/incorrect outcome.
Reveal the actual culprit and motive.
Explain the solution step by step, citing evidence item IDs/titles
shown to the player.
Explain important contradictions and, where appropriate, why red
herrings were misleading.
Display a short final narrative describing what actually happened.
Provide "Play another mystery" and "Review evidence" actions.
A wrong accusation must not be treated as a generation failure.
FR-07 --- Persistence and resume
Store the canonical case in MongoDB.
Store a playthrough record separately from the case.
A user may resume a case using a secure playthrough identifier. If
authentication is not implemented in v1, use a high-entropy
unguessable playthrough token and do not expose internal database
IDs as authorization.
Keep the canonical culprit and private solution out of all
pre-reveal API responses.
Define a configurable retention policy for anonymous cases; default
to retaining them for 30 days unless deployment requirements specify
otherwise.
If persistence or resume is not completed in the first
implementation, the case must at minimum remain available for the
current browser session and the limitation must be documented.
FR-08 --- Accessibility and usability
All interactive controls must be keyboard accessible.
Use visible focus indicators and semantic HTML.
Provide labels for form fields and accessible names for icon-only
buttons.
Do not rely on color alone to communicate clue type, accusation
status, or verdict.
Respect reduced-motion preferences.
Provide loading, error, empty, and success states for all
network-driven views.
4. Mystery Quality Rules
These rules are mandatory. A case that violates them must be rejected
and regenerated or marked as failed.

One culprit: exactly one suspect is the canonical culprit.
Solvability: the evidence shown to the player must support the
correct conclusion without requiring hidden facts.
Evidence-backed reveal: every major claim in the solution must
cite one or more evidence IDs.
No contradictions in canon: timestamps, locations, identities,
and events must be consistent unless a contradiction is an
intentional clue.
Fair red herrings: red herrings may create reasonable suspicion
but must be explainable and must not make an innocent suspect
equally supported by the full evidence set.
No answer leakage: do not include culpritId, private solution,
hidden clue labels, or internal scoring in pre-reveal API responses.
Stable canon: once stored, the culprit and evidence cannot be
regenerated during accusation or reveal.
Fiction only: use invented names, fictional organizations, and
fictional contact details. Do not create evidence intended to
impersonate real people or claim fictional evidence is authentic.
No unsafe realism: avoid detailed instructions for committing
real crimes, bypassing security, evading law enforcement, or
destroying evidence.
Content boundaries: do not generate sexual content involving
minors, graphic violence, or hateful content. If the premise asks
for disallowed content, return a safe validation error and ask for a
different premise.
4.1 Recommended generation and validation strategy
Call Gemini with a strict JSON output instruction and a schema.
Parse and validate with a server-side schema library such as Zod or
Ajv.
Run deterministic checks: suspect count, evidence count, valid IDs,
unique IDs, culprit reference exists, solution references valid
evidence, minimum timeline length, and required fields.
Run a second consistency/solvability review prompt or a
deterministic validator before acceptance.
Retry generation up to 2 times after the first failed attempt (3
total attempts). Do not silently save invalid cases.
If a generated image fails, preserve the case and replace the image
with a clearly styled text/still placeholder. Image generation must
not be required for case solvability.
Use the Gemini model name through an environment variable so it can
be changed without code edits.
5. Technical Architecture
5.1 Stack
Frontend - React with Vite. - React Router for page routing. -
TypeScript preferred for safer structured data handling; if the
repository already uses JavaScript, remain consistent rather than
migrating without approval. - CSS Modules or a single documented styling
system. Do not mix multiple UI frameworks without a clear need. -
fetch or Axios for API calls; choose one and use it consistently.

Backend - Node.js LTS. - Express.js. - JavaScript or TypeScript
matching the existing repository; prefer TypeScript for a new project. -
Google Gemini SDK for server-side model calls. - Zod or Ajv for request
and generated-output validation. - Mongoose for MongoDB models. -
Helmet, CORS configuration, and rate limiting.

Database - MongoDB Atlas or a local MongoDB instance. - Never store
Gemini API keys in MongoDB or frontend code.

Image generation - Gemini may be used for text and, only if the
selected model/API supports it, image generation. Do not assume that a
text-generation model can return images. - Put image generation behind
an ImageGenerationService interface so a compatible provider can be
configured later. - If no image provider is configured, use text-based
evidence and designed placeholder visuals. The product must still be
fully playable. - Store generated assets in an object-storage provider
in production; store only URLs and metadata in MongoDB. For local
development, a documented local asset directory is acceptable. - Never
ask the language model to invent a working image URL.

5.2 High-level architecture
React client submits premise and preferences.
Express validates request, applies rate limits, and calls the
case-generation service.
Generation service calls Gemini using server-side credentials.
Validation service checks JSON schema and mystery consistency.
MongoDB stores the canonical case and generated asset metadata.
API returns a sanitized public case view that excludes the answer.
Client displays investigation workspace and submits an accusation.
Express checks the stored culprit ID and returns the reveal payload.
Client renders results.
5.3 Suggested repository structure
ai-mystery-room/
  client/
    src/
      app/
      components/
        layout/
        mystery/
        evidence/
        suspects/
        ui/
      pages/
        HomePage.tsx
        CreateMysteryPage.tsx
        InvestigationPage.tsx
        ResultsPage.tsx
        NotFoundPage.tsx
      services/
        api.ts
      hooks/
      types/
      styles/
      main.tsx
    .env.example
    package.json
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
        geminiService.ts
        caseGenerationService.ts
        caseValidationService.ts
        imageGenerationService.ts
      schemas/
      utils/
      app.ts
      server.ts
    tests/
    .env.example
    package.json
  docs/
    SPEC.md
  README.md
This is a recommended layout, not a mandate to duplicate an existing
structure. Inspect the repository before creating files. If code already
exists, preserve its conventions and adapt the layout rather than
deleting or replacing working code.

6. Data Model
6.1 MysteryCase document
Suggested fields:

type EvidenceType = "chat" | "image" | "cctv" | "document" | "timeline";
type Difficulty = "easy" | "medium" | "hard";

interface MysteryCase {
  _id: ObjectId;
  schemaVersion: number;
  title: string;
  summary: string;
  originalPremise: string;
  adaptedPremise: string;
  difficulty: Difficulty;
  tone: string;
  incident: {
    description: string;
    location: string;
    occurredAt: string; // ISO 8601 or clearly defined fictional time
  };
  suspects: Array<{
    id: string;
    name: string;
    role: string;
    motive: string;
    alibi: string;
    publicDescription: string;
  }>;
  evidence: Array<{
    id: string;
    type: EvidenceType;
    title: string;
    description: string;
    occurredAt?: string;
    content: unknown; // Must be narrowed by a discriminated union in implementation
    assetUrl?: string;
    assetAltText?: string;
  }>;
  timeline: Array<{
    id: string;
    occurredAt: string;
    description: string;
    relatedEvidenceIds: string[];
  }>;
  solution: {
    culpritId: string;
    motive: string;
    explanation: string;
    revealNarrative: string;
    reasoningSteps: Array<{
      claim: string;
      evidenceIds: string[];
    }>;
    redHerringExplanations: Array<{
      suspectId: string;
      explanation: string;
      evidenceIds: string[];
    }>;
  };
  generation: {
    provider: "gemini";
    model: string;
    promptVersion: string;
    generatedAt: Date;
  };
  createdAt: Date;
  expiresAt?: Date;
}
Security requirement: solution must be excluded by default from
public queries and serializers. Prefer separate public and private DTOs.
Never serialize the full Mongoose document directly to the client.

6.2 Playthrough document
interface Playthrough {
  _id: ObjectId;
  caseId: ObjectId;
  tokenHash: string; // If anonymous resume tokens are used, store a hash, not the raw token
  status: "in_progress" | "submitted" | "revealed";
  notes: string;
  selectedSuspectId?: string;
  isCorrect?: boolean;
  startedAt: Date;
  submittedAt?: Date;
  revealedAt?: Date;
  expiresAt?: Date;
}
Do not use the playthrough token as a substitute for rate limiting. Do
not log raw tokens.

6.3 API response DTOs
PublicCaseDTO: contains case briefing, suspects, evidence, and
timeline; never contains the canonical culprit ID or private
solution.
PlaythroughDTO: contains playthrough status and user notes;
excludes token hash and internal database metadata.
RevealDTO: returned only after a valid final accusation; contains
verdict, culprit, motive, explanation, reasoning steps, and
referenced evidence.
7. API Contract
Base path: /api/v1

POST /cases
Creates a new mystery. Request:

{
  "premise": "A valuable prototype disappears from a university lab the night before a showcase.",
  "difficulty": "medium",
  "tone": "campus_mystery",
  "evidencePreferences": ["chat", "cctv", "document"]
}
Success: 201 Created

{
  "case": {
    "id": "case_public_id",
    "title": "The Missing Prototype",
    "summary": "A prototype vanished from a locked lab...",
    "difficulty": "medium",
    "incident": {},
    "suspects": [],
    "evidence": [],
    "timeline": []
  },
  "playthrough": {
    "id": "playthrough_public_id",
    "status": "in_progress"
  }
}
The example arrays are illustrative; the real response must follow the
DTO schema and contain generated case data. It must not include the
solution.

GET /cases/:caseId
Returns the sanitized public case for an active playthrough. If access
control is enabled, verify the playthrough token or authenticated user.
Return 404 for unknown or inaccessible resources rather than exposing
whether a private case exists.

GET /playthroughs/:playthroughId
Returns current playthrough status and notes, subject to authorization.

PATCH /playthroughs/:playthroughId/notes
Request:

{ "notes": "The camera log conflicts with the stated alibi." }
Rules: validate type and length; suggested maximum 5,000 characters.

POST /playthroughs/:playthroughId/accusation
Request:

{ "suspectId": "suspect_02" }
Rules: - Verify playthrough and case access. - Verify the case is still
in_progress. - Verify suspect ID belongs to this case. - Persist the
submitted choice and verdict. - Return the reveal payload after
submission. - Reject a second submission with 409 Conflict, unless the
product deliberately supports replay as a separate playthrough.

POST /cases/:caseId/retry-generation
Optional endpoint. Use only if generation failure is recorded and retry
is safe. Apply rate limits and do not create unlimited model calls.

GET /health
Returns a minimal service health response. Do not expose secrets,
connection strings, environment variables, or internal diagnostics.

Standard error shape
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please enter a premise between 30 and 1000 characters.",
    "requestId": "request_id"
  }
}
Use appropriate HTTP status codes: 400 invalid request, 401
unauthenticated where auth exists, 403 unauthorized action, 404
missing/inaccessible resource, 409 invalid state transition, 413
payload too large, 429 rate limit, 500 unexpected server error,
503 AI provider temporarily unavailable. Never return stack traces or
raw provider errors to the client.

8. Gemini Integration
8.1 Server-side requirements
Use the official Google GenAI SDK supported by the chosen Node.js
environment.
Read GEMINI_API_KEY and GEMINI_MODEL from server environment
variables.
Never expose these variables through Vite's VITE_* variables or
any client bundle.
Use JSON response mode/schema support when available for the chosen
model.
Set explicit timeouts, token/output limits, and bounded retries.
Log request IDs, latency, and failure categories, but not secrets or
unnecessary user content.
Treat user premises as untrusted data, not as instructions that
override system rules.
Do not include raw user-provided text in logs by default.
8.2 Generation prompt requirements
The system/developer prompt should instruct Gemini to: - Generate a
fictional, fair-play mystery from the supplied premise and
preferences. - Return only the required JSON object matching the
schema. - Create 3--5 distinct suspects and 5--9 evidence items. -
Define exactly one culprit before constructing evidence. - Make the
timeline, alibis, messages, camera logs, and documents agree except for
intentional, explainable clues. - Ensure the full evidence set logically
supports the culprit. - Include evidence-linked reasoning and explain
red herrings. - Never return markdown fences, commentary, or extra
top-level fields. - Avoid real people, real contact details, graphic
violence, and actionable criminal instructions.

8.3 Cost and reliability
Set per-request generation limits and IP/session rate limits.
Cache no user-specific output across different premises unless
content hashes and privacy implications have been reviewed.
Use a maximum of 3 total generation attempts.
Use a user-friendly fallback if Gemini is unavailable.
Do not expose chain-of-thought or hidden model reasoning. Return
concise, evidence-based explanations written for the player.
Keep prompts and schema versioned so changes are testable.
9. Visual Design and UX Direction
9.1 Design concept
A modern, immersive detective investigation room. It should feel
atmospheric and premium, but remain readable and accessible rather than
cluttered or excessively dark.

9.2 Suggested visual system
Background: deep charcoal or warm off-white surfaces with
high-contrast text; choose one consistent primary theme.
Accent: restrained amber, teal, or red used semantically and
sparingly.
Typography: one readable sans-serif for interface text; optional
monospaced type for timestamps, case IDs, and evidence metadata.
Cards: clear hierarchy, subtle borders, restrained shadows,
consistent spacing, and readable line lengths.
Evidence should be distinguishable by icon/label and content layout,
not color alone.
Use lightweight transitions; honor reduced-motion settings.
Avoid fake system alerts, fake browser UI, and excessive glitch
effects.
9.3 Main pages
Home: brand, value proposition, sample prompts, "Create a
Mystery" CTA.
Create: premise textarea, difficulty and tone controls, evidence
preferences, fictional-content note, validation.
Investigation: case briefing, suspect list, evidence board,
timeline, notes, accusation panel.
Results: verdict, culprit reveal, motive, reasoning linked to
evidence, replay CTA.
Not Found / Error: clear recovery action and no stack traces.
9.4 Responsive behavior
Desktop: multi-column investigation workspace; suspects and evidence
can sit side by side.
Tablet: collapse to fewer columns without hiding essential actions.
Mobile: single-column flow, accessible evidence detail view, sticky
accusation action only if it does not obscure content.
Test at approximately 360px, 768px, and 1280px viewport widths.
10. Security, Privacy, and Abuse Prevention
Validate and sanitize every request on the backend.
Set CORS to explicitly configured frontend origins; do not use
wildcard origins with credentials.
Use Helmet and rate limiting on case creation and accusation
endpoints.
Enforce request-body size limits.
Keep all secrets in environment variables; provide .env.example
with placeholders only.
Never trust client-submitted culprit IDs, verdicts, evidence, or
solution data.
Separate public DTO serialization from private solution data.
Escape or safely render generated text; never inject generated
content using unsafe HTML.
Restrict remote image URLs or proxy assets through a trusted storage
layer to avoid SSRF and unsafe content loading.
Avoid logging raw playthrough tokens, API keys, or private solution
payloads.
Use a TTL index only if it matches the chosen retention policy and
does not delete active cases unexpectedly.
Do not present generated fictional evidence as authentic evidence
from real incidents.
Do not collect precise location, camera access, microphone access,
or contacts. None is required for v1.
11. Environment Configuration
Server .env.example
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room
CLIENT_ORIGIN=http://localhost:5173
GEMINI_API_KEY=replace_with_your_key
GEMINI_MODEL=replace_with_supported_model_name
CASE_GENERATION_MAX_ATTEMPTS=3
CASE_RETENTION_DAYS=30
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
Client .env.example
VITE_API_BASE_URL=http://localhost:5000/api/v1
Only public configuration belongs in the client environment. Never put
GEMINI_API_KEY in the client.

12. Testing Requirements
Unit tests
Request schema rejects empty, too-short, and too-long premises.
Generated case validator rejects invalid suspect/evidence counts.
Generated case validator rejects a culprit ID that does not match a
suspect.
Solution reasoning cannot reference missing evidence IDs.
Public DTO never contains solution or culprit fields.
Accusation evaluator returns correct/incorrect against the stored
culprit.
State machine rejects accusations after a result is revealed.
Notes length and input type are validated.
Integration tests
Case creation succeeds with a valid mocked Gemini response.
Invalid Gemini output is retried and ultimately handled safely.
Gemini timeout/unavailability returns a useful error.
MongoDB persistence and retrieval work.
Public case GET never leaks the culprit.
Valid accusation returns reveal data.
Invalid suspect ID returns 400.
Repeated accusation returns 409.
Unauthorized playthrough access is rejected.
Rate limiting is enforced.
Frontend tests
Create form validates and disables submit while loading.
Loading, empty, error, and success states render correctly.
Evidence detail panel opens and closes accessibly.
User can select exactly one suspect.
Confirmation appears before final submission.
Results screen correctly handles both correct and incorrect choices.
Responsive navigation and keyboard interaction work.
End-to-end acceptance scenario
Enter a valid premise.
Generate a case.
Verify the case has 3--5 suspects, 5--9 evidence items, and at least
4 timeline events.
Inspect all evidence.
Select a suspect and submit.
Verify the result is based on the stored culprit ID.
Verify the reveal cites evidence visible before accusation.
Inspect network responses to confirm the culprit was not leaked
before submission.
Refresh and confirm the expected resume behavior.
Confirm generation failure can be retried without creating broken or
duplicate playthroughs.
13. Definition of Done
The first release is complete only when: - The app runs locally using
documented setup commands. - A user can create a mystery from a premise
using Gemini. - Generated output is validated before storage and
display. - A playable case contains all required suspects, evidence,
timeline, and solution fields. - The user can inspect evidence and
submit one accusation. - The result screen reveals the canonical culprit
and an evidence-grounded explanation. - The canonical solution is never
exposed in pre-accusation API responses. - MongoDB persistence works or
any intentionally deferred persistence is explicitly documented. - API
and UI error states are implemented. - Tests cover validation,
generation failure, solution secrecy, and accusation flow. - No secrets
are committed to source control. - README documents installation,
environment variables, development commands, testing, and
troubleshooting.

14. Implementation Plan for Codex
Implement in small, verifiable phases. Do not attempt to create the
entire application in one unreviewed change.

Phase 0 --- Repository inspection
Inspect the current repository, package manager, framework versions,
and existing conventions.
Identify existing code that should be preserved.
Create or update docs/SPEC.md with this specification.
Report a short implementation plan before making broad structural
changes.
Phase 1 --- Project foundation
Set up client and server.
Add environment configuration, health endpoint, MongoDB connection,
shared types/schemas where practical, and lint/test scripts.
Confirm both client and server start successfully.
Phase 2 --- Case schema and deterministic demo
Implement the case and playthrough models, validation, public DTO
sanitization, and accusation evaluator.
Create a clearly labeled local mock case or fixture for UI
development.
Prove with tests that the solution is not leaked.
Phase 3 --- Gemini generation
Implement Gemini service and prompt/schema.
Add validation, bounded retries, timeout handling, and failure UX.
Test malformed and inconsistent responses.
Phase 4 --- Investigation UI
Build landing/create pages, evidence board, suspect cards, timeline,
evidence details, and notes.
Use fixture data first; then connect API calls.
Phase 5 --- Accusation and reveal
Implement final accusation flow, server-side verdict, and results
screen.
Verify no second accusation is accepted for the same playthrough.
Phase 6 --- Polish and hardening
Responsive layout, accessibility, security middleware, rate limits,
loading/error states, tests, README, and deployment configuration.
Codex working rules
Treat this document as the single source of truth. If a requirement
conflicts with an implementation preference, follow this
specification.
Do not invent new product features without asking.
Do not replace the stack or introduce a second database.
Prefer small changes that can be run and tested.
Do not leave core flows as nonfunctional mock buttons.
Do not hardcode Gemini responses in production paths.
Do not expose secrets or the canonical solution to the client before
accusation.
Update this spec only when a requirement changes; record meaningful
changes in a short "Change Log" section.
Before finishing, run available tests and build commands, fix
failures caused by the implementation, and summarize what was built,
commands run, and known limitations.
15. Decisions and Explicit Assumptions
The following defaults are chosen so implementation can begin without
blocking questions: - No account system is required for v1. - Cases are
anonymous and resumable only if a secure playthrough token is
implemented; otherwise current-session play is acceptable as a
documented first milestone. - Gemini is the text-generation provider. -
Image generation is optional and provider-abstracted; the mystery must
remain playable without generated images. - CCTV evidence may be a
timestamped log, storyboard, or still image in v1; do not promise full
video generation. - Exactly one final accusation is allowed per
playthrough. - Initial retention default is 30 days for anonymous
data. - Use TypeScript for a new repository; preserve the current
language if the repository already has a working implementation. - No
authentication, payments, social sharing, multiplayer, or leaderboards
in v1.

16. Change Log
v1.0: Initial product, functional, architecture, API, data,
security, UX, testing, and Codex implementation specification.
⋮⋮⋮⋮