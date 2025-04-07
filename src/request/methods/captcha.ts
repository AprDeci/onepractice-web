import { httpclient } from "../request";

export const getEmailCaptcha = (email: string) =>
  httpclient.Get("/captcha/email", {
    params: {
      email
    },
    timeout: 60000
  });

export const verifyEmailCaptcha = (email: string, captcha: string) =>
  httpclient.Post("/captcha/email/resetverify", {
    email: email,
    code: captcha
  });
