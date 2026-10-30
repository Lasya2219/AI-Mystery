# AI Mystery Room

Create a fictional mystery, investigate the evidence, and make one final accusation. The React client talks to an Express API. Gemini credentials and the canonical solution stay on the server.

## Requirements

- Node.js 20 or newer and npm 10+
- MongoDB for persistence (optional for a local demo)
- A Google Gemini API key for AI-generated cases (optional; without one the app uses a clearly disclosed deterministic fictional demo case)

## Setup

```sh
npm install
copy server/.env.example server/.env
copy client/.env.example client/.env
npm run dev
```

The client runs at <http://localhost:5173> and the API at <http://localhost:5000>. Edit `server/.env` to add `GEMINI_API_KEY` and configure `MONGODB_URI`. The server uses the in-memory session store if MongoDB is not available; those cases are lost when the server restarts. Anonymous MongoDB records expire according to `CASE_RETENTION_DAYS` (30 days by default). Only the token hash is stored.

## Commands

- `npm run dev` — run client and server
- `npm run build` — compile the server and production-build the client
- `npm test` — run server validation tests and build the client

## Deployment

The repository includes a Render Blueprint and Vercel SPA configuration. Follow [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) to connect the GitHub repository, add the production environment variables, and deploy the API and client.

## Configuration

See `server/.env.example` and `client/.env.example`. `GEMINI_API_KEY` must remain server-side. Change `GEMINI_MODEL` to a model enabled for your API key. The optional image provider is not configured; image evidence is rendered as readable fictional text so no image generation is required to solve the case.

## Playthrough behavior

New anonymous cases return a high-entropy token once. The client keeps it in `sessionStorage` and sends it only in the playthrough authorization header. The server stores a SHA-256 token hash. Case data returned before accusation is explicitly serialized without the solution. The submitted choice is checked against the stored culprit ID; a playthrough cannot accept a second accusation. Notes are saved to the playthrough and never sent to Gemini.

## Troubleshooting

- If MongoDB is not running, the API logs that it has switched to in-memory, current-server-session storage.
- If Gemini is unavailable or returns invalid data, generation retries up to three total attempts and returns a retryable message.
- Check `GET /health` for a minimal API health response.

The full product and security requirements are in [`spec.md`](spec.md), with implementation notes in [`docs/SPEC.md`](docs/SPEC.md).
