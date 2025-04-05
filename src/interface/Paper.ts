export interface PaperData {
  paperName: string;
  examYear: number;
  examMonth: number;
  paperType: string;
  paperTime: number;
  difficulty: null | number; // 或根据实际需要改为可选属性 difficulty?: number;
  sectionCount: number;
  sectionQuestionCount: number[];
}

export interface PaperDO {
  paperId?: number;

  paperName?: string;

  examYear?: number;

  examMonth?: number;

  version?: number;

  totalTime?: number;

  type?: string;
}

export interface PaperQueryDTO {
    page?: number;
    size?: number;
    type?: string;
    year?: number;
  }