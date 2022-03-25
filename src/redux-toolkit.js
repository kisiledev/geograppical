import { createSlice, configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

const initialDataState = {
  isOpen: false,
  data: [],
};

const initialGameState = {
  questions: null,
  questionsSet: [],
  score: 0,
  correct: 0,
  incorrect: 0,
  gameMode: null,
  isStarted: false,
  gameOver: false,
  scoreChecked: true,
  timeChecked: true,
  currentCount: 60,
  gameComplete: false,
  timeMode: "countdown",
};

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: initialDataState,
  reducers: {
    saveFavorite: (state, { payload }) => {
      return [...state, (state.data = payload)];
    },
    unsaveFavorite: (state, { payload }) => {
      return [...state, state.data.filter((fav) => payload !== fav)];
    },
  },
});

const scoreSlice = createSlice({
  name: "scores",
  initialState: initialDataState,
  reducers: {
    saveScore: (state, { payload }) => {
      return [...state, (state.data = payload)];
    },
    unsaveScore: (state, { payload }) => {
      return [...state, state.data.filter((fav) => payload !== fav)];
    },
  },
});

const mapViewSlice = createSlice({
  name: "mapView",
  initialState: { value: "Show" },
  reducers: {
    changeMap: (state, { payload }) => {
      console.log(payload);
      state.value = payload;
    },
  },
});

const viewSlice = createSlice({
  name: "view",
  initialState: { value: "Default" },
  reducers: {
    changeView: (state, { payload }) => {
      console.log(payload);
      return (state.value = payload.view);
    },
  },
});

const modeSlice = createSlice({
  name: "mode",
  initialState: { value: "info" },
  reducers: {
    changeMode: (state, { payload }) => {
      console.log(payload);
      state.value = payload;
    },
  },
});

const gameModeSlice = createSlice({
  name: "gameMode",
  initialState: { value: "questions" },
  reducers: {
    changeGame: (state, { payload }) => {
      console.log(payload);
      state.value = payload;
    },
  },
});

const userSlice = createSlice({
  name: "user",
  initialState: { value: null },
  reducers: {
    loginUser: (state, { payload }) => {
      state.value = payload;
    },
  },
});

const gameSlice = createSlice({
  name: "game",
  initialState: initialGameState,
  reducers: {
    reset: (state, { payload }) => {
      state = initialGameState;
    },
    changeGame: (state, { payload }) => {
      state.gameMode = payload;
    },
    addQuestion: (state, { payload }) => {
      state.questionsSet.push(payload);
    },
  },
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
  user: userSlice.reducer,
};

export default configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
  devTools: import.meta.NODE_ENV !== "production",
});
