import { httpclient } from "../request";

export const saveRecord = (
  paperId: number,
  type: string,
  isfinished: number,
  answers: any[],
  score: number,
  totalscore: number,
  timespend: number
) =>
  httpclient.Post("/record/save", {
    paperId: paperId,
    type: type,
    isfinished: isfinished,
    answers: answers,
    score: score,
    totalscore: totalscore,
    timespend: timespend
  });

export const getRecords = (days: number) =>
  httpclient.Get("/record/list", {
    params: {
      days: days
    }
  });
