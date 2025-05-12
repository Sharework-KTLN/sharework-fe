import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice/userSlice';
import chatReducer from './slice/chatSlice';
import recruiterReducer from './slice/recruiterSlice';
import adminReducer from './slice/adminSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        recruiter: recruiterReducer,
        admin: adminReducer,
        chat: chatReducer,
    }
});

// Kiểu dữ liệu của Redux Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;