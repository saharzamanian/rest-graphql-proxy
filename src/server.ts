import express from "express";
import morgan from "morgan";
import cors from "cors";
import { GraphQLClient } from "./client";
import { GET_ITEM, GET_ITEMS } from "./graphql";
import { GetItemSchema, GetItemsSchema } from "./types";
import { HttpError, toProblem } from "./errors";

const app = express();
app.use(cors());
app.use(morgan("dev"));

// Config: allow override via env, but default to provided URL for convenience.
const DEFAULT_GRAPHQL_URL = process.env.GRAPHQL_URL ??
  "https://xtrqc3d2xbctfkgkglturz4hym.appsync-api.eu-west-1.amazonaws.com/graphql";

// Middleware to build a per-request GraphQL client using pass-through api key.
app.use((req, _res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) return next(new HttpError(401, "Missing x-api-key header"));
  (req as any).gql = new GraphQLClient({ endpoint: DEFAULT_GRAPHQL_URL, apiKey });
  next();
});

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// GET /item → list all items
app.get("/item", async (req, res, next) => {
  try {
    const gql = (req as any).gql as GraphQLClient;
    const data = await gql.request<{ getItems: unknown }>(GET_ITEMS);
    const parsed = GetItemsSchema.parse({ data });
    res.json(parsed.data.getItems);
  } catch (err) {
    next(err);
  }
});

// GET /item/:id → single item by id
app.get("/item/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const gql = (req as any).gql as GraphQLClient;
    const data = await gql.request<{ getItem: unknown }>(GET_ITEM, { id });
    const parsed = GetItemSchema.parse({ data });

    if (!parsed.data.getItem) throw new HttpError(404, `Item ${id} not found`);
    res.json(parsed.data.getItem);
  } catch (err) {
    next(err);
  }
});

// Error handler → RFC 7807-ish JSON
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const problem = toProblem(err);
  res.status((problem as any).status ?? 500).json(problem);
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`REST proxy listening on :${port}`);
});