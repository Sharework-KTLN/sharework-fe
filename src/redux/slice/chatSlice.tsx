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
        openChatWithUser(state, action: PayloadAction<{ targetUserId: number, targetUserRole: 'candidate' | 'recruiter' }>) {
            state.targetUserId = action.payload.targetUserId;
            state.targetUserRole = action.payload.targetUserRole;
            state.trigger = true;
        },
        resetChatTrigger(state) {
            state.trigger = false;
        }
    },
});

export const { openChatWithUser, resetChatTrigger } = chatSlice.actions;
export default chatSlice.reducer;
