export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number; label?: string } = {},
): Promise<T> => {
  const { maxAttempts = 3, baseDelayMs = 500, label = 'operation' } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isLastAttempt = attempt === maxAttempts;
      const isAppError =
        err?.message?.includes('not found') || err?.message?.includes('Not enough stock');

      if (isAppError || isLastAttempt) {
        throw err;
      }

      const delayMs = Math.min(baseDelayMs * Math.pow(2, attempt - 1), 8000);
      console.warn(
        `⚠️ [Retry] ${label} thất bại lần ${attempt}/${maxAttempts}. Thử lại sau ${delayMs}ms... Lỗi: ${err.message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error(`[Retry] ${label} thất bại sau ${maxAttempts} lần thử.`);
};
