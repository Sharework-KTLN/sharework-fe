import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User} from '../types/user';

interface UserState extends User {
    token: string | null;
}

// Giá trị ban đầu của state
const initialState: UserState = {
    id: null,
    full_name: "",
    email: "",
    password: "",
    role: "CANDIDATE",
    phone: "",
    profile_image: "",
    gender: "",
    date_of_birth: "",
    address: "",
    school: "",
    course: "",
    specialize: "",
    file_url: "",
    token: null
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