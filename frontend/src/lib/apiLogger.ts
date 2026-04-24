export function logApiRequest(method: string, url: string, details?: unknown) {
  console.info(`[API][REQUEST] ${method.toUpperCase()} ${url}`, details ?? '');
}

export function logApiSuccess(method: string, url: string, status: number, durationMs: number, details?: unknown) {
  console.info(
    `[API][SUCCESS] ${method.toUpperCase()} ${url} | status=${status} | ${durationMs}ms`,
    details ?? '',
  );
}

export function logApiError(method: string, url: string, durationMs: number, error: unknown) {
  console.error(
    `[API][ERROR] ${method.toUpperCase()} ${url} | ${durationMs}ms`,
    error,
  );
}
