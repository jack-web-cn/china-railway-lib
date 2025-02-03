import { MemoryCache, withInit } from '../src/utils';

describe(withInit, (): void => {
  it('should run only once', async (): Promise<void> => {
    const initialize = jest.fn();
    let func = jest.fn();
    func = withInit(func, initialize);
    expect(initialize).not.toHaveBeenCalled();
    func();
    expect(initialize).toHaveBeenCalledTimes(1);
    func();
    expect(initialize).toHaveBeenCalledTimes(1);
  });
});

describe(MemoryCache, (): void => {
  it('should cache data in memory', async (): Promise<void> => {
    jest.useFakeTimers();
    const fetchData = jest.fn();
    const data = new MemoryCache(fetchData, 5 * 1000);
    expect(fetchData).not.toHaveBeenCalled();
    await data.get();
    expect(fetchData).toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(3 * 1000);
    await data.get();
    expect(fetchData).toHaveBeenCalledTimes(1);
    await data.refresh();
    expect(fetchData).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(3 * 1000);
    await data.get();
    expect(fetchData).toHaveBeenCalledTimes(2);
    jest.advanceTimersByTime(3 * 1000);
    await data.get();
    expect(fetchData).toHaveBeenCalledTimes(3);
  });
});
