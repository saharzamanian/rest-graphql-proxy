export class HttpError extends Error {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const toProblem = (err: unknown) => {
  if (err instanceof HttpError) {
    return {
      title: err.message,
      status: err.status,
      details: err.details,
    };
  }
  if (err instanceof Error) {
    return { title: err.message, status: 500 };
  }
  return { title: "Internal Server Error", status: 500 };
};