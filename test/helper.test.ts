import { RailwayHelper } from '../src/helper';
import { PurposeCodes } from '../src/types';

it('should fetch the standard train list.', async (): Promise<void> => {
  const helper = new RailwayHelper();
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const standardTrainList = await helper.getStandardTrainList(
    date.toISOString().slice(0, 10),
    'BJP',
    'QYS',
    PurposeCodes.STUDENT,
  );
  standardTrainList.forEach((trainInfo) => {
    expect(trainInfo.numberShort).toMatch(/[CDGKLSTYZ]?\d+/);
  });
  // console.log(standardTrainList);
});
