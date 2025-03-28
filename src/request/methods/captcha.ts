import { httpclient } from "../request";

export const getEmailCaptcha = (email: string) => 
    httpclient.Get("/captcha/email", {
        params: {
            email
        },
        timeout: 60000
    }
    )