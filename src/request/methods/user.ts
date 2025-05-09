import { httpclient } from "../request";

export const login = (UsernameOrEmail: string, Password: string, recaptchatoken: string) =>
  httpclient.Post(
    `/user/login`,
    {
      usernameorEmail: UsernameOrEmail,
      password: Password,
      recaptchaToken: recaptchatoken
    },
    {
      meta: {
        authRole: "login"
      }
    }
  );
export const register = (data) =>
  httpclient.Post("user/register", {
    username: data.username,
    password: data.password,
    email: data.email,
    captchacode: data.captchacode,
    usertype: 0
  });

export const logout = () =>
  httpclient.Post(
    "user/logout",
    {},
    {
      meta: {
        authRole: "logout"
      }
    }
  );
export const getUserInfo = () => httpclient.Get("user/info");

export const resetPassword = (email, newpassword) =>
  httpclient.Post("user/resetpassword", {
    email: email,
    password: newpassword
  });
