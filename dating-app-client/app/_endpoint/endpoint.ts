export default class Endpoint {
  public static get baseUrl(): string {
    return "https://localhost:7062/api/";
  }

  public static readonly login: string = this.baseUrl + "Account/login";
  public static readonly register: string = this.baseUrl + "Account/register";
  public static readonly registerByOAuth: string =
    this.baseUrl + "Account/register-oauth";
  public static readonly usersPaginate: string =
    this.baseUrl + "Users/paginate";
}
