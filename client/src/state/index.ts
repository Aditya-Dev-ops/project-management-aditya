import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface initialStateTypes {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  isError: boolean;
  isSuccess:boolean;
  Error: {
    error: string | null ;
  } | null
}

const initialState: initialStateTypes = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  isError:false,
  Error: null,
  isSuccess:false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setError:(state , action: PayloadAction<boolean>)=>{
      state.isError  =  action.payload;
    },
    setSuccess:(state , action: PayloadAction<boolean>)=>{
      state.isSuccess = action.payload;
    }, 
    setMessage : (state , action : PayloadAction<{
      error:string;
    } | null >)=>{
        state.Error = action.payload;
      }
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode  , setError , setMessage , setSuccess} = globalSlice.actions;
export default globalSlice.reducer;