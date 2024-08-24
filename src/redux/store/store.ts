import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../slices/authSlice.ts';

// const customMiddleware: Middleware<NonNullable<unknown>, never , Dispatch<Action>> = () => (next) => (action) => {
//     console.log('Dispatching action:', action);
//     return next(action);
// };
  
  
const store = configureStore({
  reducer: {
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

});

// RootState와 AppDispatch 타입 정의
// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



// useDispatch를 커스터마이징한 훅
export default store;
