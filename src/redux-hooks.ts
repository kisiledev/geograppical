import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';
import { AppDispatch, RootState } from './redux-toolkit';
import { useStore } from 'react-redux';

export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
export const useSelector = useReduxSelector.withTypes<RootState>();
