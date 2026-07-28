/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { getAccessToken } from "./getAccessToken";

interface Pagination {
  limit: number;
  total?: number;
  page?: number;
  totalPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  nextCursor?: string | null;
  prevCursor?: string | null;
}
export interface FetchResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | null;
  pagination?: Pagination;
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions {
  method?: HttpMethod;
  body?: any;
  token?: string;
  headers?: Record<string, string>;
  cache?: RequestCache;
  tags?: string[];
  next?: NextFetchRequestConfig;
}

export const myFetch = async <T = any>(
  url: string,
  {
    method = "GET",
    body,
    tags,
    token,
    headers = {},
    cache = "default",
    next = {},
  }: FetchOptions = {},
): Promise<FetchResponse<T>> => {
  const accessToken = await getAccessToken();
  const isFormData = body instanceof FormData;
  const hasBody = body !== undefined && method !== "GET";

  const reqHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(token ? { Authorization: `${token}` } : {}),
  };

  try {
    const res = await fetch(`${process.env.BASE_URL}${url}`, {
      method,
      headers: reqHeaders,
      ...(hasBody && {
        body: isFormData ? body : JSON.stringify(body),
      }),
      cache: method === "GET" ? cache : "no-store",
      next: {
        ...next,
        ...(tags && { tags }),
      },
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: json?.message,
        error: Array.isArray(json?.errorMessages)
          ? json.errorMessages.map((e: any) => e.message).join(", ")
          : json?.errorMessages || "Request failed",
      };
    }

    return {
      success: true,
      message: json?.message,
      data: json?.data,
      error: null,
      pagination: json?.pagination,
    };
  } catch (err) {
    return {
      success: false,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
