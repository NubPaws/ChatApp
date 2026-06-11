# Yuval & Rami's Chat App

A chat application you can use from the browser or an Android app. Users register
an account, log in, and chat in real time with anyone else on the same server.

This repository is a **pnpm workspace monorepo**:

| Package | Path | Stack |
| --- | --- | --- |
| Backend | [`backend/`](backend) | TypeScript · Express 5 · Mongoose 9 · Socket.IO · Firebase Cloud Messaging |
| Web client | [`react-app/`](react-app) | TypeScript · React 19 · Vite · React Router 7 · Socket.IO client |
| Shared types | [`packages/shared/`](packages/shared) | `@chatapp/shared` — API + socket contracts used by both apps |
| Android app | [`android-app/`](android-app) | Java · Gradle · Retrofit2 · Room · FCM (standalone) |

The backend, web client, and shared types are tested with **Vitest** and type-checked
with **TypeScript**. The Android app is a standalone Gradle project and is built with
Android Studio as before.

## Prerequisites

- **Node.js 20+** (22 LTS recommended — see [`.nvmrc`](.nvmrc))
- **pnpm** (`corepack enable` will provide the pinned version)
- A running **MongoDB** instance for the backend

## Getting started

Install every workspace's dependencies from the repository root:

```bash
pnpm install
```

### Backend

1. Create `backend/.env` from the template and fill in the values
   (see [`backend/.env.example`](backend/.env.example)):

   ```bash
   cp backend/.env.example backend/.env
   ```

   `JWT_KEY` is **required** — the server refuses to start without it. Firebase
   credentials are optional (push notifications are simply disabled if absent).

2. Make sure MongoDB is running. If you don't have a server, you can start one
   against a local data directory with `pnpm --filter backend run database`
   (requires `mongod` on your PATH).

3. Run the backend in watch mode:

   ```bash
   pnpm --filter backend dev      # or: pnpm dev:backend
   ```

   The server listens on `http://localhost:5000/` and also serves the built web
   client from `backend/public/`.

### Web client

```bash
pnpm --filter chat-app dev        # or: pnpm dev:web
```

Vite serves the app on `http://localhost:3000/`. The backend URL defaults to
`http://localhost:5000`; override it with `VITE_API_URL` / `VITE_SOCKET_URL`
(see [`react-app/.env.example`](react-app/.env.example)).

## Common tasks

Run these from the repository root; they fan out across all workspaces:

```bash
pnpm -r test          # run the Vitest suites
pnpm -r typecheck     # type-check every package
pnpm -r build         # build shared types, backend (dist/), and the web client
```

You can scope any of them to one package, e.g. `pnpm --filter backend test`.
Coverage is available per package via `pnpm --filter backend run test:coverage`
and `pnpm --filter chat-app run coverage`. Continuous integration
([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs typecheck, tests,
and build on every push and pull request.

## About

To create the application, the following technologies were used:

- **Web client** — React (TypeScript) bundled with Vite, talking to the backend
  over REST and WebSockets (Socket.IO).
- **Backend** — Node.js + Express (TypeScript) exposing REST endpoints and a
  Socket.IO server, MongoDB via Mongoose for storage, and Firebase Cloud
  Messaging for Android push notifications. It also serves the built web client.
- **Android app** — Java with OOP and event-driven design, Retrofit2 for REST,
  Room for local SQLite storage, and Firebase Cloud Messaging for instant
  delivery. It is unchanged by the TypeScript migration and is built with
  Android Studio.

## Credits

Most images are from [wikimedia.org](https://commons.wikimedia.org) and fall
under free use. Other images were taken from
[Bootstrap's icon collection](https://icons.getbootstrap.com/) or were made
in house by our graphics team (which is just one person).
