import { xxapiclient } from "../apiclient";

export const getwordmean = (word: string) =>
  xxapiclient.Get("englishwords", {
    params: {
      word: word
    },
    cacheFor: 0
  });
