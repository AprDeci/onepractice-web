// 分割答案工具类,每四个(ABCD)为一组
export const splitAnswer = (answers: string[]) => {
    return Array.from({ length: Math.ceil(answers.length/ 4) }, (_, i) =>
        answers.slice(i * 4, i * 4 + 4)
    );
}