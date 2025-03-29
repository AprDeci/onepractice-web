import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import vueHook from 'alova/vue';
import { createClientTokenAuthentication } from 'alova/client';
import { fetchError,HttpRequestError,BusinessLogicError } from '../common/errors';

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({    
    async login(response,method){
        const json = await response.clone().json()
        console.log(json)
        localStorage.setItem('token',json.data.token)
    },
    logout(response,method){
        localStorage.removeItem('token')
    }
    // ...
  });

export const httpclient = createAlova({
    requestAdapter:adapterFetch(),
    baseURL: 'http://127.0.01:8080/api',
    shareRequest: true,
    timeout: 5000,
    statesHook: vueHook,
    beforeRequest:onAuthRequired(method=>{
        method.config.headers.token = localStorage.getItem('token')
    }),
    responded:onResponseRefreshToken({
        onSuccess: async(Response,method)=>{
            if(Response.status !== 200) {
                throw new HttpRequestError(Response.statusText)
            }
            const json = await Response.json()
            if(json.code !== 200){
                throw new BusinessLogicError(json.msg)
            }
            return json.data;
        },
        onError: (err,method) => {
            throw new fetchError(err) 
        },
        onComplete: (method) => {
            
        }
    })
})