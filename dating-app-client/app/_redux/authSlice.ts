import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IMemberResponseModel } from "../_models/_members/IMemberResponseModel";

export interface IAuthState extends IMemberResponseModel {
  isLoggedIn: boolean;
  token: string;
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
