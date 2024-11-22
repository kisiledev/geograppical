/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */

import { CountryType } from './CountryType';

interface DateCreated {
  seconds: number;
  nanoseconds: number;
}

interface GameData {
  correct: number;
  dateCreated: DateCreated;
  gameMode: string;
  incorrect: number;
  questions: Question[];
  score: number;
  time: number;
  userId: string;
}

interface DataItem<T> {
  id: string;
  data: T;
}

interface AcctDataType {
  isOpen: boolean;
  data: DataItem<CountryType | GameData>[];
}

export type { AcctDataType };

export interface ScoreType {
  isOpen: boolean;
  data: {
    id: string;
    data: {
      correct: number;
      dateCreated: {
        seconds: number;
        nanoseconds: number;
      };
      gameMode?: string;
      incorrect?: number;
      questions: {
        answers: {
          correct: number;
          id: number;
          name: string;
        }[];
        correct: boolean;
        country: string;
      }[];
      score?: number;
      time?: number;
      userId: string;
    };
  }[];
}

export interface FavType {
  isOpen: boolean;
  data: {
    id: string;
    data: CountryType;
  }[];
}

export type DataType = CountryType[];

interface MatchParams {
  country: string;
}

export interface MatchType {
  isExact: boolean;
  params: MatchParams;
  path: string;
  url: string;
}
export interface SliceStates {
  value: string;
}
export interface InitialGameState {
  questions: Question[] | null;
  questionsSet: Question[];
  score: number;
  correct: number;
  incorrect: number;
  gameMode: string;
  isStarted: boolean;
  gameOver: boolean;
  scoreChecked: boolean;
  timeChecked: boolean;
  currentCount: number;
  gameComplete: boolean;
  timeMode: string;
}

export interface Country {
  name: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number;
  flag: string;
  languages: string[];
  currencies: string[];
  borders: string[];
  timezones: string[];
  latlng: number[];
  alpha2Code: string;
  alpha3Code: string;
}

export interface FavoriteState {
  isOpen: boolean;
  data: Country[];
}

export interface FavoritePayload {
  isOpen: boolean;
  data: Country;
}
export interface Answer {
  correct: number;
  id: number;
  name: string;
}

export interface Question {
  answers: Answer[];
  correct: boolean;
  country: string;
}

export interface IsoData {
  [key: string]: number | string;
}
export interface ScoreData {
  correct: number;
  dateCreated: {
    seconds: number;
    nanoseconds: number;
  };
  gameMode?: string;
  incorrect?: number;
  questions: Question[];
  score?: number;
  time?: number;
  userId: string;
}

export interface ScoreState {
  isOpen: boolean;
  data: {
    id: string;
    data: ScoreData;
  }[];
}

export interface ProviderData {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  phoneNumber?: any;
  providerId?: string;
}

export interface StsTokenManager {
  apiKey?: string;
  refreshToken?: string;
  accessToken?: string;
  expirationTime?: number;
}

export interface UserType {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  emailVerified?: boolean;
  phoneNumber?: any;
  isAnonymous?: boolean;
  tenantId?: any;
  providerData?: ProviderData[];
  apiKey?: string;
  appName?: string;
  authDomain?: string;
  stsTokenManager?: StsTokenManager;
  redirectEventId?: any;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface UserState {
  user: UserType | null;
}

export interface ScorePayload {
  isOpen: boolean;
  data: {
    id: string;
    data: ScoreData;
  };
}
