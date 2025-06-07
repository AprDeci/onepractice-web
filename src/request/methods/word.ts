import { httpclient } from "../request";

export const collectword = (word: string) => httpclient.Post("word/add", { word });

export const hascollected = (word: string) => httpclient.Post("word/hascollected", { word });

export const getCollectedWords = (page: number, size: number) =>
  httpclient.Post("word/getcollectedwords", { page, size });
