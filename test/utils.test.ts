import { withInit } from '../src/utils';

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
