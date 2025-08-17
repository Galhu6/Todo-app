# Todo App

A Full-Stack productivity app (React + Vite + TS, Express + Postgres). Features:

- Auth (Email/Google) with HTTP-only cookies
  Lists, tasks, micro-tasks, recurring items
  -Optional WhatsApp notifications via Twilio

## Quick Start (Local)

### Prerequisites

- Node 20+
- Postgres 14+
- .env based on `.env.example`
- Optional Python 3.10+ for stats microservice

### Setup

```bash
#install dependencies
npm install

# start backend
npm run dev:server

# start frontend
npm run dev

# start stats microservice (optional)
cd stats_service && uvicorn main:app -- reload
```

Set `VITE_SERVER_URL` to your server URL (default http:localhost:3000).
Set `VITE_STATS_SERVICE_URL` to the stats microservice URL if different from `http://localhost:8000/stats`.

## Enviroment

Copy `.env.exemple` -> `.env` and vill values.

## CORS & Cookies

Cross-site cookies require aligned CORS settings:

-**Server**: set `CLIENT_URL` to your frontend origin and enable CORS with `credentials: true` -**Frontend**: make request with `credential: "include"`.

- Confirm in the browser's network tab that `Set_Cookie` is present; authenticated request should then return `200`.
- in production, cookies should be set with `samsSite: 'none` and `secure: true`.

## Scripts

`npm run dev` - start fronend dev

`npm run dev:server` - start backend dev

`npm run seed` - seed demo data

`npm test` - run tests

## API (Selected)

POST /api/ath/login - return cookies (access/refresh)

POST /api/auth/refresh - rotates tokens

GET /api/lists - list current user's lists

POST /api/lists/:listId/tasks - create task

## Security

Helmet CORS (allowlist), rate limiting

HTTP-only cookies for JWT

Zod Validation

## Demo

(to be added)

## Deployment

Frontend: Vercel

Backend+DB: Render/Railway
