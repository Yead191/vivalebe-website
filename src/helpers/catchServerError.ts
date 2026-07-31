import { unstable_rethrow } from "next/navigation";

/**
 * Re-throws Next.js redirect/notFound errors so they are not swallowed by
 * try/catch, then returns the fallback for real failures.
 */
export function catchServerError<T>(
  error: unknown,
  label: string,
  fallback: T,
): T {
  unstable_rethrow(error);
  console.error(label, error);
  return fallback;
}
