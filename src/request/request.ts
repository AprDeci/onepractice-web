import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";
import { createClientTokenAuthentication } from "alova/client";
import { fetchError, HttpRequestError, BusinessLogicError } from "../common/errors";
import { useAlert } from "../common/alert";

const { showAlert } = useAlert();
const { onAuthRequired, onResponseRefreshToken } = createClientTokenAuthentication({
  async login(response, method) {
    const json = await response.clone().json();
    if (json.code === 200) {
      localStorage.setItem("token", json.data.token);
    }
  },
  async logout(response, method) {
    localStorage.removeItem("token");
  }
  // ...
});

export const httpclient = createAlova({
  requestAdapter: adapterFetch(),
  baseURL: import.meta.env.VITE_BASE_URL,
  shareRequest: true,
  timeout: 5000,
  statesHook: vueHook,
  beforeRequest: onAuthRequired((method) => {
    method.config.headers.token = localStorage.getItem("token");
  }),
  responded: onResponseRefreshToken({
    onSuccess: async (Response, method) => {
      if (Response.status !== 200) {
        showAlert(Response.statusText, "error");
        throw new HttpRequestError(Response.statusText);
      }
      const json = await Response.json();
      if (json.code === 10005) {
        localStorage.removeItem("token");
        const router = window.appRouter;
        if (router) {
          router.push({ name: "login" });
        }
      }
      if (json.code !== 200) {
        showAlert(json.msg, "error");
      }
      return json.data;
    },
    onError: (err, method) => {
      showAlert(err, "error");
      throw new fetchError(err);
    },
    onComplete: (method) => {}
  })
});
