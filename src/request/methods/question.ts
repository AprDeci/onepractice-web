import type { ExamQuestionRespDTO, AnswerDTO } from "../../interface/Question";
import { httpclient } from "../request";

export const getAllQuestionsBypaperIdSplitByPart = (Id: string) =>
  httpclient.Get<ExamQuestionRespDTO>("/question/getAllByIdSplitByPart", {
    params: {
      Id
    },
    meta: {
      authRole: null
    }
  });

export const getAnswersByPaperId = (Id: string) =>
  httpclient.Get<AnswerDTO>("/question/getAnswersByPaperId", {
    params: {
      Id
    },
    meta: {
      authRole: null
    }
  });
