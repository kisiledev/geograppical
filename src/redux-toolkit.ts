import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {
  FavoriteData,
  FavoritePayload,
  FavoriteState,
  InitialGameState,
  Question,
  ScorePayload,
  ScoreState,
  SliceStates,
  UserState
} from './helpers/types';

const initialDataState = {
  isOpen: false,
  data: []
};

const initialGameState = {
  questions: null,
  questionsSet: [],
  score: 0,
  correct: 0,
  incorrect: 0,
  gameMode: '',
  isStarted: false,
  gameOver: false,
  scoreChecked: true,
  timeChecked: true,
  currentCount: 60,
  gameComplete: false,
  timeMode: 'countdown'
};

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: initialDataState,
  reducers: {
    saveFavorite: (
      state: FavoriteState,
      action: PayloadAction<FavoriteData>
    ) => {
      const { payload } = action;
      state.data = [...state.data, payload.data];
    },
    unsaveFavorite: (
      state: FavoriteState,
      action: PayloadAction<FavoritePayload>
    ) => {
      const { payload } = action;
      state.data = state.data.filter((fav) => payload.data !== fav);
    }
  }
});

const scoreSlice = createSlice({
  name: 'scores',
  initialState: initialDataState,
  reducers: {
    saveScore: (state: ScoreState, action: PayloadAction<ScorePayload>) => {
      const { payload } = action;
      state.data = [...state.data, payload.data];
    },
    unsaveScore: (state: ScoreState, action: PayloadAction<ScorePayload>) => {
      const { payload } = action;
      state.data = state.data.filter((score) => payload.data !== score);
    }
  }
});

const mapViewSlice = createSlice({
  name: 'mapView',
  initialState: { value: 'Show' },
  reducers: {
    changeMap: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      const { payload } = action;
      console.log(payload);
      state.value = payload.value;
    }
  }
});

const viewSlice = createSlice({
  name: 'view',
  initialState: { value: 'Default' },
  reducers: {
    changeView: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      console.log(action);
      const { payload } = action;
      console.log(payload);
      state.value = payload.value;
    }
  }
});

const modeSlice = createSlice({
  name: 'mode',
  initialState: { value: 'info' },
  reducers: {
    changeMode: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      const { payload } = action;
      console.log(payload);
      state.value = payload.value;
    }
  }
});

const gameModeSlice = createSlice({
  name: 'gameMode',
  initialState: { value: 'questions' },
  reducers: {
    changeGame: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      const { payload } = action;
      console.log(payload);
      state.value = payload.value;
    }
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    loginUser: (state: UserState, action: PayloadAction<UserState>) => {
      const { payload } = action;
      state.user = payload.user;
    }
  }
});

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    reset: (
      state: InitialGameState,
      action: PayloadAction<InitialGameState>
    ) => {
      const { payload } = action;
      state = payload;
    },
    changeGame: (
      state: InitialGameState,
      action: PayloadAction<SliceStates>
    ) => {
      const { payload } = action;
      state.gameMode = payload.value;
    },
    addQuestion: (state: InitialGameState, action: PayloadAction<Question>) => {
      const { payload } = action;
      state.questionsSet.push(payload);
    }
  }
});
export const { saveFavorite, unsaveFavorite } = favoriteSlice.actions;

export const { saveScore, unsaveScore } = scoreSlice.actions;

export const { changeMap } = mapViewSlice.actions;

export const { changeView } = viewSlice.actions;

export const { changeMode } = modeSlice.actions;

export const { changeGame } = gameModeSlice.actions;

export const { loginUser } = userSlice.actions;

const reducers = {
  favorites: favoriteSlice.reducer,
  scores: scoreSlice.reducer,
  mapView: mapViewSlice.reducer,
  view: viewSlice.reducer,
  mode: modeSlice.reducer,
  gameMode: gameModeSlice.reducer,
  user: userSlice.reducer
};
const store = configureStore({
  reducer: reducers
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
