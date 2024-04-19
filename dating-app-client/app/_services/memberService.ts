import Endpoint from "../_endpoint/endpoint";
import { axiosInstance } from "../_middleware/authenticate";
import { IMemberResponseModel } from "../_models/_members/IMemberResponseModel";
import { IPaginateRequestModel } from "../_models/_paginate/IPaginateRequestModel";

export class MemberService {
  public static readonly getPaginate = async (
    payload: IPaginateRequestModel
  ) => {
    try {
      const response: IMemberResponseModel[] = await axiosInstance.get(
        Endpoint.usersPaginate +
          `?PageSize=${payload.pageSize}&PageNum=${payload.pageNum}`
      );
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  public static readonly getByEmail = async (email: string) => {
    try {
      const response: IMemberResponseModel = await axiosInstance.get(
        Endpoint.userByEmail + `${email}`
      );
      return response;
    } catch (error) {
      console.error("Error making request:", error);
    }
  };
}
