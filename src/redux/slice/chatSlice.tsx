// redux/slices/chatSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
    targetUserId: number | null;
    targetUserRole: 'candidate' | 'recruiter' | null;
    trigger: boolean;
}

const initialState: ChatState = {
    targetUserId: null,
    targetUserRole: null,
    trigger: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // Action để kích hoạt việc mở chat với một user khác
        triggerChat: (state, action: PayloadAction<{ userId: number; userRole: 'candidate' | 'recruiter' }>) => {
            state.trigger = true;
            state.targetUserId = action.payload.userId;
            state.targetUserRole = action.payload.userRole;
        },
        // Action để reset trigger sau khi đã xử lý
        resetChatTrigger: (state) => {
            state.trigger = false;
        }
    },
});

export const { triggerChat, resetChatTrigger } = chatSlice.actions;
export default chatSlice.reducer;
