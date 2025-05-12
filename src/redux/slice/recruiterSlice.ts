// slices/recruiterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/user';

interface RecruiterState extends User {
    token: string | null;
}

const initialState: RecruiterState = {
    id: null,
    full_name: "",
    email: "",
    password: "",
    role: "recruiter",
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

const recruiterSlice = createSlice({
    name: 'recruiter',
    initialState,
    reducers: {
        loginRecruiter: (state, action: PayloadAction<RecruiterState>) => {
            return action.payload;
        },
        logoutRecruiter: () => {
            return initialState;
        }
    }
});

export const { loginRecruiter, logoutRecruiter } = recruiterSlice.actions;
export default recruiterSlice.reducer;
