import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    full_name: string;
    email: string;
    avatar: string;
    token: string | null;
}

// Giá trị ban đầu của state
const initialState: UserState = {
    id: null,
    full_name: "",
    email: "",
    avatar: "",
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) => {
            return action.payload;
        },
        logout: (state) => {
            return initialState;
        }
    }
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;