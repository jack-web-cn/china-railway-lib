import { MemoryCache, withInit } from '../src/utils';

it('should run only once', async (): Promise<void> => {
  let result = 0;
  let count = 0;
  let add = async (x: number): Promise<void> => {
    result += x;
  };
  add = withInit(add, async (): Promise<void> => {
    count += 1;
  });
  await add(1);
  await add(2);
  await add(4);
  expect(count).toBe(1);
  expect(result).toBe(7);
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
