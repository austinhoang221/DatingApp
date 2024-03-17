import { IMemberResponseModel } from "../_members/IMemberResponseModel";

export interface IAuthenticateResponseModel extends IMemberResponseModel{
  token: string;
}
