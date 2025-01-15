import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit';
import {
  InitialGameState,
  Question,
  SliceStates,
  UserState
} from './helpers/types';

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

const mapViewSlice = createSlice({
  name: 'mapView',
  initialState: { value: 'Show' },
  reducers: {
    changeMap: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      const { payload } = action;

      state.value = payload.value;
    }
  }
});

const viewSlice = createSlice({
  name: 'view',
  initialState: { value: 'Default' },
  reducers: {
    changeView: (state: SliceStates, action: PayloadAction<SliceStates>) => {
      const { payload } = action;

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

export const { changeMap } = mapViewSlice.actions;

export const { changeView } = viewSlice.actions;

export const { changeMode } = modeSlice.actions;

export const { changeGame } = gameModeSlice.actions;

export const { loginUser } = userSlice.actions;

const reducers = {
  mapView: mapViewSlice.reducer,
  view: viewSlice.reducer,
  mode: modeSlice.reducer,
  gameMode: gameModeSlice.reducer,
  user: userSlice.reducer
};
const store = configureStore({
  reducer: reducers
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
