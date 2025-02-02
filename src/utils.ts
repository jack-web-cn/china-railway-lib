export function withInit<T extends (...args: unknown[]) => Promise<unknown>>(
  func: T,
  initialize: (() => Promise<unknown>) | (() => unknown),
): T {
  let initialized = false;
  return (async (...args: unknown[]): Promise<unknown> => {
    if (!initialized) {
      initialized = true;
      await initialize();
    }
    return func(...args);
  }) as T;
}
