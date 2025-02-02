import { fetch } from 'node-fetch-native';
import { CookieJar } from 'tough-cookie';

export type Fetch = typeof fetch;

export interface HelperConfig {
  fetch: Fetch;
  cookieJar: CookieJar;
}

export const enum PurposeCodes {
  ADULT = 'ADULT',
  STUDENT = '0X00',
}

export type TrainNumberPrefix =
  | ''
  | 'C'
  | 'D'
  | 'G'
  | 'K'
  | 'L'
  | 'S'
  | 'T'
  | 'Y'
  | 'Z';
export type TrainNumberShort = `${TrainNumberPrefix}${number}`;

export type Station = string;

export const enum Accomendation {
  BUSINESS_CLASS = '商务座',
  PREMIUM_CLASS = '特等座',
  PREFERRED_FIRST_CLASS = '优选一等座',
  FIRST_CLASS = '一等座',
  SECOND_CLASS = '二等座/二等包座',
  SOFT_SEAT = '软座',
  HARD_SEAT = '硬座',
  DELUXE_SOFT_SLEEPER = '高级软卧',
  SOFT_SLEEPER = '软卧/动卧/一等卧',
  HARD_SLEEPER = '硬卧/二等卧',
  STANDING = '无座',
}

export type Available = '有';
export type Tickets = number | Available;
export type AllTickets = Partial<Record<Accomendation, Tickets>>;

export interface TrainInfo {
  number: string;
  numberShort: TrainNumberShort;
  startingStation: Station;
  endingStation: Station;
  departureStation: Station;
  arrivalStation: Station;
  departureTime: Date;
  arrivalTime: Date;
  bookable: boolean;
  allLeftTickets: AllTickets;
}
