import { httpclient } from "../request";

export const saveRecord = (
  paperId: number,
  type: string,
  isfinished: number,
  answers: any[],
  score: number,
  totalscore: number,
  timespend: number,
  hasspendtime: number
) =>
  httpclient.Post("/record/save", {
    paperId: paperId,
    type: type,
    isfinished: isfinished,
    answers: answers,
    score: score,
    totalscore: totalscore,
    timespend: timespend,
    hasspendtime: hasspendtime
  });

export const getRecords = (days: number) =>
  httpclient.Get("/record/list", {
    params: {
      days: days
    }
  });

export const updateRecord = (
  recordId: string | number,
  paperId: number,
  type: string,
  isfinished: number,
  answers: any[],
  score: number,
  totalscore: number,
  timespend: number,
  hasspendtime: number
) =>
  httpclient.Post("/record/update", {
    recordId: recordId,
    paperId: paperId,
    type: type,
    isfinished: isfinished,
    answers: answers,
    score: score,
    totalscore: totalscore,
    timespend: timespend,
    hasspendtime: hasspendtime
  });
