import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";


//constants
const SAVE_FAVORITE = "SAVE_FAVORITE";
const UNSAVE_FAVORITE = "UNSAVE_FAVORITE";
const SAVE_SCORE = "SAVE_SCORE";
const UNSAVE_SCORE = "UNSAVE_SCORE";
const CHANGE_MAPVIEW = "CHANGE_MAPVIEW";
const CHANGE_VIEW = "CHANGE_VIEW";
const TOGGLE_SIDEBAR = "TOGGLE_SIDEBAR";
const CHANGE_MODE = "CHANGE_MODE";
const GAME_MODE = "GAME_MODE";
const LOGIN_USER = 'LOGIN_USER'
const MAKE_FAVORITE = 'MAKE_FAVORITE'
const UNMAKE_FAVORITE = 'UNMAKE_FAVORITE'

//actions
export const saveFavoriteActionCreator = (country) => {
  return {
    type: SAVE_FAVORITE,
    payload: {
      country,
    },
  };
};

export const unsaveFavoriteActionCreator = (country) => {
  return {
    type: UNSAVE_FAVORITE,
    payload: {
      country,
    },
  };
};

export const saveScoreActionCreator = ({
  userId,
  gameMode,
  dateCreated,
  score,
  correct,
  incorrect,
  time,
  questions,
}) => {
  return {
    type: SAVE_SCORE,
    payload: {
      userId,
      gameMode,
      dateCreated,
      score,
      correct,
      incorrect,
      time,
      questions,
    },
  };
};

export const unsaveScoreActionCreator = (id) => {
  return {
    type: UNSAVE_SCORE,
    payload: { id },
  };
};

export const changeMapViewActionCreator = (view) => {
  return {
    type: CHANGE_MAPVIEW,
    payload: { view },
  };
};

export const changeViewActionCreator = (view) => {
  return {
    type: CHANGE_VIEW,
    payload: { view },
  };
};

export const toggleSidebarActionCreator = (showSidebar) => {
  return {
    type: TOGGLE_SIDEBAR,
    payload: { showSidebar },
  };
};

export const changeModeActionCreator = (mode) => {
  return {
    type: CHANGE_MODE,
    payload: { mode },
  };
};

export const gameModeActionCreator = (mode) => {
  return {
    type: GAME_MODE,
    payload: { mode },
  };
};

export const loginUserActionCreator = (user) => {
  return {
    type: LOGIN_USER,
    payload: {user}
  };
}

export const makeFavoriteActionCreator = (bool) => {
  return {
    type: MAKE_FAVORITE,
    payload: {bool}
  }
}
//Reducers

const favoritesReducer = (state = {isOpen: false, data: []}, action) => {
  switch (action.type) {
    case SAVE_FAVORITE: {
      const {payload} = action
      console.log(state, payload)
      return [...state, state.data = payload]
    }
    case UNSAVE_FAVORITE: {
      const {payload} = action
      return [...state, state.data.filter(fav => payload !== fav)]
    }
    default:
      return state;
  }
}
const scoresReducer = (state = {isOpen: false, data: []}, action) => {
  switch (action.type) {
    case SAVE_SCORE: {
      const {payload} = action
      return [...state, state.data = payload]
    }
    case UNSAVE_SCORE: {
      const {payload} = action
      return [...state, state.data.filter(fav => payload !== fav)]
    }
    default:
      return state;
  }
}
const mapViewReducer = (state = 'Show', action) => {
  switch (action.type) {
    case CHANGE_MAPVIEW: {
      const {payload} = action;
      return payload.view
    }
    default:
      return state;
  }
}
const viewReducer = (state = 'default', action) => {
  switch (action.type) {
    case CHANGE_VIEW: {
      const {payload} = action;
      return payload.view
    }
    default:
      return state;
  }
}
const toggleReducer = (state = true, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR: {
      const { payload } = action;
      return payload.showSidebar
    }
    default:
      return state;
  }
}
const modeReducer = (state = 'info', action) => {
  switch (action.type) {
    case CHANGE_MODE: {
      const {payload} = action;
      return payload.mode
    }
    default:
      return state;
  }
}

const gameModeReducer = (state = 'questions' | null, action) => {
  switch (action.type) {
    case GAME_MODE: {
      const {payload} = action;
      return payload.mode
    }
    default:
      return state;
  }
}
const userReducer = (state = null, action) => {
  switch (action.type) {
    case LOGIN_USER:
      const {payload} = action;
      return payload.user
    default:
      return state
  }
}
const reducers = combineReducers({
  favorites: favoritesReducer,
  scores: scoresReducer,
  mapView: mapViewReducer,
  view: viewReducer,
  toggleSidebar: toggleReducer,
  mode: modeReducer,
  gameMode: gameModeReducer,
  user: userReducer
})

export default createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(thunk, logger)
  )
)