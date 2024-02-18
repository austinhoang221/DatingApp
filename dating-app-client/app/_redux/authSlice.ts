import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IAuthState {
  isLoggedIn: boolean;
  userName: string;
  token: string;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  userName: "",
  token: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IAuthState>) => {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...action.payload,
        isLoggedIn: true,
      };
    },
  },
});
export const { login } = authSlice.actions;
export const authReducer = authSlice.reducer;
