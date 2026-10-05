const MAX_RETRIES = 5;
const BASE_DELAY_MS = 1000;

export function backoffDelay(attempt: number): number {
  return Math.min(BASE_DELAY_MS * 2 ** attempt, 30000);
}

export async function withRetry<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    if (attempt >= MAX_RETRIES) throw e;
    await new Promise((r) => setTimeout(r, backoffDelay(attempt)));
    return withRetry(fn, attempt + 1);
  }
}

export { MAX_RETRIES };
