// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function withInit<T extends (...args: any[]) => Promise<any>>(
  func: T,
  initialize: (() => Promise<unknown>) | (() => unknown),
): T {
  let initialized = false;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return (async (...args: any[]): Promise<any> => {
    if (!initialized) {
      initialized = true;
      await initialize();
    }
    return func(...args);
  }) as T;
}

export abstract class CachedData<T> {
  /**
   * @param fetchData - 获取数据的函数，异步或同步均可
   * @param ttl - 缓存存活时间，单位为毫秒
   */
  constructor(
    protected readonly fetchData: (() => Promise<T>) | (() => T),
    protected readonly ttl: number,
  ) {}
  abstract refresh(): Promise<void>;
  abstract get(): Promise<T>;
}

/**
 * 使用内存缓存数据
 *
 * @example
 * ```typescript
 * const data = new MemoryCache<Date>(() => new Date(), 5 * 1000);
 * ```
 */
export class MemoryCache<T> extends CachedData<T> {
  #data: T;
  #expireTime: number = 0;

  constructor(fetchData: (() => Promise<T>) | (() => T), ttl: number) {
    super(fetchData, ttl);
  }

  async refresh(): Promise<void> {
    this.#data = await this.fetchData();
    this.#expireTime = Date.now() + this.ttl;
  }

  async get(): Promise<T> {
    if (this.#expireTime < Date.now()) await this.refresh();
    return this.#data;
  }
}
