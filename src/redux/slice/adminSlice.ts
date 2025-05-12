// slices/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

interface AdminState extends User {
    token: string | null;
}

const initialState: AdminState = {
    id: null,
    full_name: "",
    email: "",
    password: "",
    role: "admin",
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

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        loginAdmin: (state, action: PayloadAction<AdminState>) => {
            return action.payload;
        },
        logoutAdmin: () => {
            return initialState;
        }
    }
});

export const { loginAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
