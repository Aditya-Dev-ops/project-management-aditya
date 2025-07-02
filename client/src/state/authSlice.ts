import { createSlice , PayloadAction } from "@reduxjs/toolkit";

interface AuthSlice {
    token: string  | null;
    userId: number | null;
    email: string  | null;
}

const initialState : AuthSlice = {
    token:  null,
    userId: null,
    email:  null,
} 

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setAuthData:(
            state,
            action: PayloadAction <AuthSlice>) => {
                state.token = action.payload.token;
                state.userId = action.payload.userId;
                state.email = action.payload.email;
            },
            logout:(state)=>{
                state.token =null;
                state.userId = null;
                state.email =null;
            },
    },
});

export const {setAuthData , logout} = authSlice.actions;

export default authSlice.reducer;