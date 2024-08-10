import { configureStore } from '@reduxjs/toolkit';

import { useDispatch } from 'react-redux';


// const customMiddleware: Middleware<NonNullable<unknown>, never , Dispatch<Action>> = () => (next) => (action) => {
//     console.log('Dispatching action:', action);
//     return next(action);
// };
  
  
const store = configureStore({
  reducer: {
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

});

// RootState와 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// useDispatch를 커스터마이징한 훅
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
