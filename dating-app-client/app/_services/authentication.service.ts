import Endpoint from "../_endpoint/endpoint";
import { axiosInstance } from "../_middleware/authenticate";

export class AuthenticationService {
  public static readonly logIn = async (payload: any) => {
    try {
      const response: any = await axiosInstance.post(Endpoint.login, payload);
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  public static readonly register = async (payload: any) => {
    try {
      const response: any = await axiosInstance.post(
        Endpoint.register,
        payload
      );
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };
}
