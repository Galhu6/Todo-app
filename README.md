# Todo App

This repository contains a full stack application for managing TODO lists. The front end is built with **React**, **TypeScript** and **Vite**, styled using **Tailwind CSS**, while the back end exposes a REST API using **Express** and **PostgreSQL**.

## Getting Started

Install dependencies and start both servers during development:

```bash
npm install
npm run dev:server    # start the Express API with nodemon
npm run dev           # start the Vite development server
```

Environment variables are expected in a `.env` file and include:

- `DATABASE_URL` – connection string for PostgreSQL
- `JWT_SECRET` – secret used to sign authentication tokens
- `CLIENT_ID` – Google OAuth client id (for social login)
- `OPENAI_API_KEY` – API key for OpenAI requests

## Project Structure

```
src/
  server.ts             # Express application entry point
  db.ts                 # PostgreSQL connection helper
  controllers/          # Route handlers
  routes/               # API route definitions
  services/             # Database access logic
  middlewares/          # Reusable Express middleware
  components/           # React UI components
  screens/              # Page level React components
```

### Backend

The API is defined in `src/server.ts` and mounts three main route groups:

- `api/auth` – authentication endpoints
- `api/lists` – CRUD operations for lists
- `api/` – task related endpoints

Controllers under `src/controllers` handle incoming requests by calling service functions. Service modules encapsulate SQL queries using the `pg` module. Authentication uses **JWT** tokens generated in `Auth/authService.ts`. Middleware such as `authMiddleware` and `verifyOwnerships` enforce token validation and resource ownership.

### Frontend

React components live in `src/components` and are grouped by feature:

- **Auth** – login, signup and Google OAuth components
- **Dashboard** – lists and tasks management UI
- **DashboardProtection** – redirects unauthenticated users
- **Navbar**, **Footer**, **ImageCarousell** and **LogoGrid** – layout components
  The LogoGrid arranges technology logos in a responsive grid that scales across screen sizes.

Screen components in `src/screens` assemble these pieces. The entry point `App.tsx` defines routes using `react-router-dom`.

Data fetching happens in small API wrappers (`listsApi.ts` and `tasksApi.ts`) which call the Express backend with the user token.

The UI supports light and dark themes. Click the sun/moon button or press **D** at any time to toggle dark mode.

### Database

A basic schema for users, lists and tasks is expected (see `schema.sql`). `db.ts` exposes a single `Pool` instance used by the service layer. Each service (e.g. `listService.ts` or `tasksService.ts`) performs parameterised queries and returns plain JavaScript objects to the controllers.

### AI Chat

The `/api/ai/chat` endpoint exposes a simple AI assistant powered by OpenAI. Lists now include an `overall_goal` field which the assistant uses to recommend and evaluate tasks. The chat can also create new lists or tasks when asked, storing them via the backend services.

## Testing

Unit tests can be executed with:

```bash
npm test
```

Jest is configured through `jest.config.ts`. Currently there are no application specific test files, but the configuration is in place for future additions.


