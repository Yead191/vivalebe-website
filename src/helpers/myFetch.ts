/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { unstable_rethrow } from "next/navigation";
import { getAccessToken } from "./getAccessToken";
import { redirectToSubscriptionIfNeeded } from "./handleSubscriptionError";

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

function resolveErrorMessage(json: any): string {
  if (Array.isArray(json?.errorMessages)) {
    return json.errorMessages.map((e: any) => e.message ?? e).join(", ");
  }
  if (typeof json?.errorMessages === "string") return json.errorMessages;
  if (typeof json?.error === "string") return json.error;
  return "Request failed";
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

    await redirectToSubscriptionIfNeeded({
      message: json?.message,
      error: json?.error,
      errorMessages: json?.errorMessages,
    });

    if (!res.ok || json?.success === false) {
      return {
        success: false,
        message: json?.message,
        error: resolveErrorMessage(json),
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
    unstable_rethrow(err);
    return {
      success: false,
      message: "Network error",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
};
