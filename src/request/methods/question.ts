import type { ExamQuestionRespDTO } from "../../interface/Question";
import { httpclient } from "../request";

export const getAllQuestionsBypaperIdSplitByPart = (Id: string) =>
  httpclient.Get<ExamQuestionRespDTO>("/question/getAllByIdSplitByPart", {
    params: {
      Id
    }
  });
