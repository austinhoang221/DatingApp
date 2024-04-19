import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IMemberResponseModel } from "../_models/_members/IMemberResponseModel";
import { getuid } from "process";

export interface IAuthState extends IMemberResponseModel {
  isLoggedIn: boolean;
  token: string;
  toastId: number;
  toastMessage: string;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  id: "",
  userName: "",
  token: "",
  photoUrl: "",
  created: "",
  lastActive: "",
  knownAs: "",
  gender: "",
  introduction: "",
  city: "",
  age: 0,
  photos: [],
  toastId: 0,
  toastMessage: "",
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
    showUnauthorizedMessage: (state, action: PayloadAction<string>) => {
      console.log("here");
      return {
        ...state,
        toastId: Math.random(),
        toastMessage: action.payload,
      };
    },
  },
});
export const { login, showUnauthorizedMessage } = authSlice.actions;
export const authReducer = authSlice.reducer;
