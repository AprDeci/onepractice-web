import { createAlova } from "alova";
import adapterFetch from "alova/fetch";
import vueHook from "alova/vue";
import { HttpRequestError } from "../common/errors";

export const xxapiclient = createAlova({
  baseURL: "https://v2.xxapi.cn/api/",
  statesHook: vueHook,
  requestAdapter: adapterFetch(),
  responded: {
    onSuccess: async (response, method) => {
      if (response.status >= 400) {
        throw new HttpRequestError(response.statusText);
      }
      const json = await response.json();
      if (json.code !== 200) {
        throw new Error(json.message);
      }
      return json.data;
    }
  }
});
