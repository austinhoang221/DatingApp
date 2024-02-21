import Endpoint from "../_endpoint/endpoint";
import { axiosInstance } from "../_middleware/authenticate";
import { IAuthenticateRequestModel } from "../_models/_auth/IAuthenticateRequestModel";
import { IAuthenticateResponseModel } from "../_models/_auth/IAuthenticateResponseModel";

export class AuthenticationService {
  public static readonly logIn = async (payload: IAuthenticateRequestModel) => {
    try {
      const response: IAuthenticateResponseModel = await axiosInstance.post(
        Endpoint.login,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  public static readonly register = async (
    payload: IAuthenticateRequestModel
  ) => {
    try {
      const response: IAuthenticateResponseModel = await axiosInstance.post(
        Endpoint.register,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };
}
