import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

function formatZodError(err: z.ZodError): string {
  return err.issues.map((i: z.ZodIssue) => `${i.path.join(".")}: ${i.message}`).join("; ");
}

/**
 * Validates `req.body` against the provided Zod schema.
 * Replaces req.body with the parsed/coerced result on success.
 * Returns HTTP 400 with field-level detail on failure.
 */
export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: "Validation error", details: formatZodError(result.error) });
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Validates `req.params` against the provided Zod schema.
 * Mutates params in-place with coerced values on success.
 * Returns HTTP 400 with field-level detail on failure.
 */
export function validateParams<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      res.status(400).json({ error: "Invalid parameters", details: formatZodError(result.error) });
      return;
    }
    Object.assign(req.params, result.data);
    next();
  };
}

/**
 * Validates `req.query` against the provided Zod schema.
 * Stores the coerced result in `res.locals.query` (because Express 5 exposes
 * `req.query` as a read-only getter — direct assignment is not possible).
 * Route handlers must read from `res.locals.query` to access coerced values.
 * Returns HTTP 400 with field-level detail on failure.
 */
export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: "Invalid query parameters", details: formatZodError(result.error) });
      return;
    }
    // Store coerced query in res.locals since req.query is a getter in Express 5
    res.locals["query"] = result.data;
    next();
  };
}
