import { httpclient } from "../request";
import type { PaperData } from "../../interface/Paper";

export const getallpaper = () => httpclient.Get("/paper/all");

export const getPaperswithQueryBypage = (page, size, type, year) =>
  httpclient.Post("/paper/getPaperwithQuerys", {
    page,
    size,
    type,
    year
  });

export const getpaperBytype = (type: string) =>
  httpclient.Get("/paper/type", {
    params: {
      type
    }
  });

export const getAllPaperTypes = () => httpclient.Get("/paper/types");

export const getPaperIntro = (id: number | string) =>
  httpclient.Get<PaperData>("/paper/intro", {
    params: {
      id
    }
  });
