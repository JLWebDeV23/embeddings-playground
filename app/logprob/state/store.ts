import { configureStore } from '@reduxjs/toolkit';
import treeReducer from './tree/treeSlice';

export const store = configureStore({
  reducer: { treeReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
