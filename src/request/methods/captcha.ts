import { httpclient } from "../request";

export const getEmailCaptcha = (email: string) =>
  httpclient.Get("/captcha/email", {
    params: {
      email
    },
    meta: {
      authRole: null
    },
    timeout: 60000
  });
