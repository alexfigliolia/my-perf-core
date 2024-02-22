import type { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
}

export type None = Record<string, never>;

export interface IPaginatedQuery<T> {
  offset?: number;
  limit?: number;
  sort?: keyof T;
  search?: string;
}
