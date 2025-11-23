# TinyLink – Next.js URL Shortener (MongoDB, with Health/Uptime + Search)

This repository contains a TinyLink implementation using **MongoDB + Mongoose**
with:

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- shadcn-style UI components
- MongoDB via Mongoose (no Prisma)
- REST API under `/api/links`
- Healthcheck under `/healthz` with **system details and uptime**
- Redirects under `/{code}`
- Stats page under `/code/:code`
- Dashboard with **search by code or URL**

## 1. Prerequisites

- Node.js 18 or later
- A MongoDB instance (e.g. MongoDB Atlas, local MongoDB)
- npm, pnpm, or yarn (examples below use **npm**)

## 2. Initial setup

1. Extract the repository, for example:

   ```bash
   E:\Projects\Tinyurl\tinynext-mongo
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create your `.env` file:

   ```bash
   cp .env.example .env
   ```

4. Edit `.env` and set `MONGODB_URI` to your actual MongoDB connection string, e.g.:

   ```env
   MONGODB_URI="mongodb+srv://USER:PASSWORD@cluster0.mongodb.net/tinylink?retryWrites=true&w=majority"
   ```

There are **no migrations**; the `links` collection is created automatically
when documents are inserted.

## 3. Healthcheck endpoint

- `GET /healthz` returns:

  ```json
  {
    "ok": true,
    "version": "1.1.0",
    "timestamp": "2025-11-22T18:30:00.000Z",
    "uptimeSeconds": 123.45,
    "uptimeHuman": "123s",
    "environment": "development",
    "nodeVersion": "v18.x.x"
  }
  ```

This satisfies the **system details and uptime details** requirement.

## 4. Dashboard search/filter

- `GET /` displays:
  - Creation form (long URL + optional code)
  - Search input: **filters by short code or target URL** (case-insensitive)
  - List of existing links (with stats and actions)

The search box filters client-side over the loaded list:

- If search is empty → all links are shown.
- If search has text → only links where `code` or `url` contains the text are shown.

## 5. API surface

### 5.1 Links collection

- `POST /api/links` – create a new TinyLink.
- `GET /api/links` – list all links (newest first).

Codes must match `[A-Za-z0-9]{6,8}` when supplied; otherwise a random code is
generated.

### 5.2 Single-link operations

- `GET /api/links/{code}` – returns stats for a single TinyLink.
- `DELETE /api/links/{code}` – deletes the link:
  - Returns HTTP 204 when deleted.
  - Returns 404 if the code does not exist.

After deletion, visiting `/{code}` returns 404.

## 6. Redirect and stats

### 6.1 Redirect

- `GET /{code}`:
  - Finds the link document by `code`.
  - If found:
    - Increments `clicks`.
    - Updates `lastClickedAt` to the current time.
    - Redirects to `targetUrl`.
  - If not found: 404.

### 6.2 Stats page

- `GET /code/{code}`:
  - Shows:
    - Short code
    - Short URL
    - Target URL
    - Total clicks
    - Created at
    - Last clicked

## 7. Running the application

Start the development server:

```bash
npm run dev
```

Then open:

- <http://localhost:3000> – dashboard with search
- <http://localhost:3000/healthz> – healthcheck with uptime/system info
