import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    id: number | null;
    full_name: string;
    email: string;
    candidateId: string;
    profile_image: string;
    token: string | null;
    role: string;
}

// Giá trị ban đầu của state
const initialState: UserState = {
    id: null,
    full_name: "",
    email: "",
    candidateId: "",
    profile_image: "",
    token: null,
    role: ""
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