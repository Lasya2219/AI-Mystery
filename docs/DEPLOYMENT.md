# Deploy to Vercel and Render

This repository is an npm-workspaces monorepo. Deploy the React/Vite client as a Vercel static site and the Express API as a Render web service. The checked-in [`vercel.json`](../vercel.json) and [`render.yaml`](../render.yaml) contain the build, routing, health-check, and runtime settings.

## Before deploying

1. Push the project to the GitHub repository and branch you want to deploy.
2. Create a MongoDB database (for example, MongoDB Atlas) and a database user. Configure its network access so the Render service can connect.
3. Have a Google Gemini API key ready. Keep it for the Render service only; never add it to Vercel or a `VITE_*` variable.

## 1. Create the Vercel project

1. In Vercel, import the Git repository.
2. Keep **Root Directory** at the repository root (the default/blank setting, or `.` if the dashboard requires a value), not `client`. The root npm workspace lockfile and `vercel.json` are used by the build.
3. Use the Vite framework preset. The checked-in config sets `npm ci`, `npm run build --workspace client`, `client/dist`, and the SPA rewrite for routes such as `/investigation` and `/results`.
4. Add this environment variable for **Production** (and Preview too if you want preview deployments to call the API):

   | Name | Value |
   | --- | --- |
   | `VITE_API_BASE_URL` | `https://YOUR-RENDER-SERVICE.onrender.com/api/v1` |

   You can create the Vercel project before Render and add the final value after the Render service exists. Redeploy Vercel after changing a `VITE_*` variable; Vite embeds it at build time.
5. Deploy and copy the production site origin, such as `https://your-project.vercel.app` (no trailing slash).

## 2. Create the Render API service

1. In Render, create a **Blueprint** from the same Git repository and select `render.yaml`.
2. Keep the service at the repository root. The Blueprint builds the server workspace and starts its compiled Express server.
3. Enter these values when Render asks for the unsynced variables:

   | Name | Value |
   | --- | --- |
   | `MONGODB_URI` | Your MongoDB connection string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `CLIENT_ORIGIN` | The exact Vercel production origin from step 1 |

   The other server settings, including `GEMINI_MODEL`, retention, and rate limits, are defined in `render.yaml`.
4. Apply the Blueprint and wait for the service health check at `/health` to pass. Copy its `https://...onrender.com` URL.
5. Return to Vercel, set `VITE_API_BASE_URL` to `https://YOUR-RENDER-SERVICE.onrender.com/api/v1`, then redeploy.

If you add a custom Vercel domain, add its exact HTTPS origin to `CLIENT_ORIGIN` as well. Multiple origins can be comma-separated. Update the Render variable and redeploy/restart the service after changing it.

## Verify the deployment

- Open `https://YOUR-RENDER-SERVICE.onrender.com/health`; it should return `{"status":"ok"}`.
- Open the Vercel site, create a mystery, inspect evidence, save notes, and submit an accusation.
- In browser developer tools, confirm API calls use the Render URL and the pre-accusation case response has no `solution` or `culpritId`.
- Check Render logs if startup fails. Production startup requires `MONGODB_URI`, `GEMINI_API_KEY`, and `CLIENT_ORIGIN`; it will not silently start with volatile in-memory storage.

## Deploying with dashboards instead of the Blueprint

Use a Render Node web service with root directory blank, build command `npm ci --include=dev && npm run build --workspace server`, start command `npm run start --workspace server`, and health-check path `/health`. Add the same environment variables listed above. In Vercel, keep the project root at `.`, install command `npm ci --include=dev`, build command `npm run build --workspace client`, output directory `client/dist`, and set `VITE_API_BASE_URL` as above.
