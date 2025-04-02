import { defineStore } from "pinia";
import { ref } from "vue";
import type { answer } from "../interface/Question";

export const usepaperStore = defineStore(
  "paper",
  () => {
    const currentPaperAnswer = ref({});

    const currentuserAnswer = ref({});

    const currentPaperId = ref();

    //   初始化正确答案
    const setCurrentPaperAnswer = (answers, paperId) => {
      currentPaperAnswer.value = answers.reduce((acc, item) => {
        acc[item.index] = item.answer;
        return acc;
      }, {});
      currentPaperId.value = paperId;
    };

    const updateCurrentUserAnswer = (index, answer) => {
      currentuserAnswer.value = {
        ...currentuserAnswer.value,
        [index]: answer
      };
    };

    const batchUpdateCurrentUserAnswer = (answers) => {
      currentuserAnswer.value = {
        ...currentuserAnswer.value,
        ...answers
      };
    };

    const getUserAnswer = (index) => {
      return currentuserAnswer.value[index];
    };

    const getCurrentPaperAnswer = (index) => {
      return currentPaperAnswer.value[index];
    };

    const calculateScore = () => {
      let score = 0;
      for (const [index, userAnswer] of Object.entries(currentuserAnswer.value)) {
        if (currentPaperAnswer.value[index] === userAnswer) {
          score += 1;
        }
      }
      return score;
    };

    const clearCurrentUserAnswer = () => {
      currentuserAnswer.value = {};
    };

    return {
      currentPaperAnswer,
      currentuserAnswer,
      currentPaperId,
      setCurrentPaperAnswer,
      updateCurrentUserAnswer,
      batchUpdateCurrentUserAnswer,
      getUserAnswer,
      getCurrentPaperAnswer,
      calculateScore,
      clearCurrentUserAnswer
    };
  },
  { persist: { key: "paperkey" } }
);
