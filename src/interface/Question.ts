export interface QuestionsDO {
  questionId: number;
  paperId: number;
  partName: string; // 写作/听力/阅读/翻译
  sectionName: string; // A/B/C等部分
  questionType: string; // writing,listening,cloza,matching,reading,translation
  questionOrder: number;
  content: string; // 题目内容或要求
  correctAnswer: answer[]; // 统一答案存储
  readingSplitQuestion: string[]; // 阅读理解分题专用
  options: option[]; // 选择题选项，格式: [{"label":"A","content":"选项内容"},...]
  wordBank: string[]; // 选词填空的单词库，格式: ["word1", "word2", ...]
  matchingData: readitem[]; // 匹配题数据，格式: {"paragraphs": {"A":"段落内容",...}, "items": [{"id":1,"content":"匹配项内容"},...]}
}

export interface QuestionPart {
  questions: QuestionsDO[];
}

export interface ExamQuestionRespDTO {
  paperId: number;
  questionParts: QuestionPart[];
}

export interface option {
  label: string;
  content: string;
}

export interface readitem {
  id: number;
  content: string;
}

export interface matchingData {
  paragraphs: Record<string, string>;
  items: readitem[];
}

export interface answer {
  index: number;
  answer: string;
}

export interface AnswerDTO {
  paperId: number;
  answers: answer[];
}
