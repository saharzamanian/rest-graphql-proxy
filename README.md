# REST → GraphQL Proxy

A small Express + TypeScript server that exposes:

- `GET /item` → lists all items
- `GET /item/:id` → returns a single item

Both endpoints authenticate to the upstream GraphQL API using the **same** `x-api-key` header provided by the client (pass-through authentication).

## Run on terminal

```bash
# 1) install deps
npm ci

# or use this command for npm installation
npm install

# 2) (optional) set endpoint if different
cp .env.example .env

# 3) start dev server (auto-reload)
npm run dev

# or build + run
npm run build && npm start
```

Server listens on `http://localhost:3000` by default.

## Test with curl

> `<api-key>` should be replaced with the key is given.

**Health check**
```bash
curl -s -H "x-api-key: <api-key>" http://localhost:3000/health
```

**List items**
```bash
curl -s -H "x-api-key: <api-key>" http://localhost:3000/item
```

**Get single item**
```bash
curl -s -H "x-api-key: <api-key>" http://localhost:3000/item/1
```

If the `x-api-key` header is missing, the server responds with `401`.
If an item is not found, it responds with `404`.

## Notes on design
- **Type safety**: Responses are validated with **Zod** schemas at the edge of the system.
- **Error handling**: Centralized handler returns a small RFC7807‑like JSON problem document.
- **Authentication**: Strict pass‑through—no server‑side storage of secrets. The upstream URL is configurable with `GRAPHQL_URL`.
- **Extensibility**: It is able to expanded more routes by creating a GraphQL document in `src/graphql.ts`, a Zod schema in `src/types.ts`, and wiring in `src/server.ts`.
- **Deployability**: Single Dockerfile for containerized deployment (This part is just optional in this assignment).



