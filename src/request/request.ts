import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import vueHook from 'alova/vue';
import { createClientTokenAuthentication } from 'alova/client';

const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({    
    async login(response,method){
        const json = await response.clone().json()
        console.log(json)
        localStorage.setItem('token',json.data.token)
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
                throw new Error(Response.statusText)
            }
            const json = await Response.json()
            if(json.code !== 200){
                throw new Error(json.msg)
            }
            return json.data;
        },
        onError: (err,method) => {
            alert(err.message);
        },
        onComplete: (method) => {
            
        }
    })
})