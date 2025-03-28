import { httpclient } from "../request";

export const login =(UsernameOrEmail:string,Password:string)=> 
    httpclient.Post(
        `/user/login`,{
            usernameorEmail: UsernameOrEmail,
            password: Password
    },{
        meta:{
            authRole: 'login'
        }
    }
) 
export const register = (data) =>
    httpclient.Post(
        'user/register',{
            username: data.username,
            password: data.password,
            email: data.email,
            captchacode: data.captchacode,
            usertype: 0

        }
    )
export const getUserInfo = () =>
    httpclient.Get(
        'user/info'
    )
