import type { GraphQLError } from "./types";

export interface GraphQLClientOptions {
  endpoint: string;
  apiKey: string;
}

export class GraphQLClient {
  constructor(private opts: GraphQLClientOptions) {}

  async request<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(this.opts.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.opts.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GraphQL HTTP ${res.status}: ${text}`);
    }

    const payload = (await res.json()) as {
      data?: unknown;
      errors?: GraphQLError[];
    };

    if (payload.errors && payload.errors.length) {
      const message = payload.errors.map((e) => e.message).join("; ");
      throw new Error(message);
    }

    return payload.data as T;
  }
}