import { configureStore } from "@reduxjs/toolkit";
import genericReducer from "../features/generic/genericSlice";
import { bookApi } from "../features/book/bookApi";
import { memberApi } from "../features/memebers/memberApi";

export const store = configureStore({
  reducer: {
  generic: genericReducer,
    [bookApi.reducerPath]: bookApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(
      bookApi.middleware,
      memberApi.middleware // <-- Add this
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
