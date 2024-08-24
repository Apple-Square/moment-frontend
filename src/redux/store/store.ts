import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slices/authSlice.ts';
import {useDispatch, useSelector, useStore} from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppStore = typeof store;
export type AppDispatch = typeof store.dispatch;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// useDispatch를 커스터마이징한 훅
// export default store;