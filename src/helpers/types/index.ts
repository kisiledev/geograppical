import { AlertColor } from "@mui/material";
import { CountryType } from "./CountryType";
import { store } from "../toolkitSlices";

interface DateCreated {
  seconds: number;
  nanoseconds: number;
}

export interface GameData {
  correct: number;
  dateCreated: DateCreated;
  gameMode: string;
  incorrect: number;
  questions: Question[];
  score: number;
  time: number;
  userId: string;
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
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

export interface FactbookData {
  data: CountryType;
}
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

export interface FavoriteState {
  isOpen: boolean;
  data: {
    id: string;
    data: CountryType;
  }[];
}

export interface FavoritePayload {
  isOpen: boolean;
  data: {
    id: string;
    data: CountryType;
  }[];
}

export type FavoriteData = {
  id: string;
  data: CountryType;
}[];

export type ScoreData = {
  id: string;
  data: GameData;
}[];

export interface ScorePayload {
  isOpen: boolean;
  data: {
    id: string;
    data: GameData;
  }[];
}
export interface ScoreState {
  isOpen: boolean;
  data: {
    id: string;
    data: GameData;
  }[];
}
export interface Answer {
  correct: number;
  id: number;
  name: string;
}

export interface Question {
  answers: Answer[];
  correct: boolean | null;
  country: string;
}

export interface IsoData {
  [key: string]: number | string;
}
export type AccountDataType = "favorites" | "scores";

export type Message = {
  link: string;
  linkContent: string;
  content: string;
  style: AlertColor;
};

export interface ProviderData {
  uid?: string;
  displayName?: string;
  photoURL?: string;
  email?: string;
  phoneNumber?: string;
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
  phoneNumber?: string;
  isAnonymous?: boolean;
  tenantId?: string;
  providerData?: ProviderData[];
  apiKey?: string;
  appName?: string;
  authDomain?: string;
  stsTokenManager?: StsTokenManager;
  redirectEventId?: string;
  lastLoginAt?: string;
  createdAt?: string;
}

export interface UserState {
  user: UserType | null;
}

export interface IsoDataContainer {
  name: string | number;
  shortName: string | number;
  isoCode: string | number;
  capital: string | number;
}
