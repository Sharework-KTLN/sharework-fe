import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import chatReducer from './slice/chatSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        chat: chatReducer,
    }
});

// Kiểu dữ liệu của Redux Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;