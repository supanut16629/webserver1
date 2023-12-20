import { createSlice } from '@reduxjs/toolkit';

const initialState =[]

const accountSlice = createSlice({
    name:'account',
    initialState,
    reducer:{
        logIn: (state,action) =>{
            const user = action.payload
        },
        logOut: (state,action) =>{
            const user = action.payload
        }
    }
})

export const {logIn,logOut} = accountSlice.actions;
export default accountSlice.reducer;