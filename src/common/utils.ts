import { useUtilStore } from "../store/utilStore";
const utilStore = useUtilStore();
// 分割答案工具类,每四个(ABCD)为一组
export const splitAnswer = (answers: string[]) => {
  return Array.from({ length: Math.ceil(answers.length / 4) }, (_, i) =>
    answers.slice(i * 4, i * 4 + 4)
  );
};

// 查词
// 使用正则匹配单词（按空格分割，保留连字符和撇号等常见情况）
export const wrapWordsWithSpan = (inputString: string) => {
  if (inputString) {
    if (utilStore.dictionaryMode)
      return inputString.replace(
        /\b([a-zA-Z'-]+)\b/g,
        "<span class='word wordactive' word=true>$1</span>"
      );
    else return inputString.replace(/\b([a-zA-Z'-]+)\b/g, "<span class='word' word=true>$1</span>");
  }
};
