import makeFetchCookie from 'fetch-cookie';
import { fetch } from 'node-fetch-native';

import {
  Accomendation,
  AllTickets,
  Fetch,
  HelperConfig,
  PurposeCodes,
  Station,
  TrainInfo,
  TrainNumberShort,
} from './types';
import * as URLS from './urls';
import { withInit } from './utils';

function appendTickets(
  allTickets: AllTickets,
  accomendation: Accomendation,
  rawTickets: string,
): void {
  if (!rawTickets) return;
  if (rawTickets === '有') {
    allTickets[accomendation] = '有';
  } else if (rawTickets === '无') {
    allTickets[accomendation] = 0;
  } else {
    allTickets[accomendation] = Number(rawTickets);
  }
}

function parseTrainInfo(rawTrainInfo: string, date: string): TrainInfo {
  const splitList = rawTrainInfo.split('|');

  const departureTime = new Date(`${date} ${splitList[8]} UTC+8`);
  const [durationHour, durationMinute] = splitList[10].split(':').map(Number);
  const arrivalTime: Date = new Date(
    departureTime.getTime() + (durationHour * 60 + durationMinute) * 60 * 1000,
  );

  const allTickets: AllTickets = {};
  appendTickets(allTickets, Accomendation.BUSINESS_CLASS, splitList[32]); // 商务座
  appendTickets(allTickets, Accomendation.PREMIUM_CLASS, splitList[25]); // 特等座
  appendTickets(allTickets, Accomendation.PREFERRED_FIRST_CLASS, splitList[20]); // 优选一等座
  appendTickets(allTickets, Accomendation.FIRST_CLASS, splitList[31]); // 一等座
  appendTickets(allTickets, Accomendation.SECOND_CLASS, splitList[30]); // 二等座
  appendTickets(allTickets, Accomendation.DELUXE_SOFT_SLEEPER, splitList[21]); // 高级软卧
  appendTickets(allTickets, Accomendation.SOFT_SLEEPER, splitList[23]); // 软卧
  appendTickets(allTickets, Accomendation.HARD_SLEEPER, splitList[28]); // 硬卧
  appendTickets(allTickets, Accomendation.SOFT_SEAT, splitList[24]); // 软座
  appendTickets(allTickets, Accomendation.HARD_SEAT, splitList[29]); // 硬座
  appendTickets(allTickets, Accomendation.STANDING, splitList[26]); // 无座
  // 22、27、33 处几乎都是空字符串，具体代表什么未知

  return {
    number: splitList[2],
    numberShort: splitList[3] as TrainNumberShort,
    startingStation: splitList[4],
    endingStation: splitList[5],
    departureStation: splitList[6],
    arrivalStation: splitList[7],
    departureTime: departureTime,
    arrivalTime: arrivalTime,
    bookable: splitList[11] === 'Y',
    allLeftTickets: allTickets,
  };
}

/**
 * 铁路 12306 助手。
 */
export class RailwayHelper {
  readonly #fetch: Fetch;

  /**
   * @param config - Helper 配置，可以指定 fetch 函数和 cookieJar
   */
  constructor(config?: HelperConfig) {
    this.#fetch = config?.fetch ?? makeFetchCookie(fetch, config?.cookieJar);
    this.#fetch = withInit(this.#fetch, async (): Promise<void> => {
      await this.#fetch(URLS.RAILWAY_PREFIX);
    });
  }

  async #getWithParams(
    baseUrl: string,
    params: Record<string, string>,
  ): Promise<Response> {
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params).toString();
    const response = await this.#fetch(url.toString());
    return response;
  }

  /**
   * 获得某日从指定出发地到目的地的所有列车信息。
   * @param date - 要查询的日期，格式为 'yyyy-mm-dd'
   * @param fromStation - 出发地的车站代号
   * @param toStation - 目的地的车站代号
   * @param purposeCodes - 购票类型，普通票为 'ADULT'，学生票为 '0X00'，默认为普通票
   * @returns 返回符合条件的列车信息列表
   *
   * @example
   * ```typescript
   * import { RailwayHelper, PurposeCodes } from 'china-railway-lib';
   * const helper = new RailwayHelper();
   * const standardTrainList = helper.getStandardTrainList(
   *   '2025-02-05',
   *   'BJP',
   *   'QYS',
   * ); // 查询 2025 年 2 月 5 日从北京到泉州的所有成人票列车信息
   * ```
   */
  public async getStandardTrainList(
    date: string,
    fromStation: Station,
    toStation: Station,
    purposeCodes: PurposeCodes = PurposeCodes.ADULT,
  ): Promise<TrainInfo[]> {
    const response = await this.#getWithParams(URLS.STANDARD_TRAIN_QUERY, {
      'leftTicketDTO.train_date': date,
      'leftTicketDTO.from_station': fromStation,
      'leftTicketDTO.to_station': toStation,
      purpose_codes: purposeCodes,
    });
    const json = await response.json();
    const trainInfoList: TrainInfo[] = json.data.result.map(
      (rawTrainInfo: string): TrainInfo => parseTrainInfo(rawTrainInfo, date),
    );
    return trainInfoList;
  }
}
