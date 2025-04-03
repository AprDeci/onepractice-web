import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { answer } from "../interface/Question";

interface paperdata {
  paperId: string;
  userAnswers: answer[] | null;
  correctAnswers: answer[] | null;
  timestamp: number;
}
export const usepaperStore = defineStore(
  "paperStore",
  () => {
    const papersData = ref<Record<number, paperdata>>({}); // 所有试卷数据 { paperId: { userAnswers, correctAnswers, timestamp } }
    const currentPaperId = ref<number | null>(null); // 当前试卷ID

    const currentUserAnswers = computed(() => {
      if (!currentPaperId.value) return {};
      return papersData.value[currentPaperId.value]?.userAnswers || {};
    });

    const currentCorrectAnswers = computed(() => {
      if (!currentPaperId.value) return {};
      return papersData.value[currentPaperId.value]?.correctAnswers || {};
    });

    //   当前试卷得分
    const currentScore = computed(() => {
      const userAnswers = currentUserAnswers.value;
      const correctAnswers = currentCorrectAnswers.value;

      return Object.keys(userAnswers).reduce((score, index) => {
        return score + (userAnswers[index] === correctAnswers[index] ? 1 : 0);
      }, 0);
    });

    //   设置当前试卷正确答案
    const setCurrentPaper = (paperId, correctAnswers) => {
      currentPaperId.value = paperId;

      if (!papersData.value[paperId]) {
        papersData.value[paperId] = {
          userAnswers: {},
          correctAnswers: correctAnswers.reduce((acc, item) => {
            acc[item.index] = item.answer;
            return acc;
          }, {}),
          timestamp: Date.now(),
          lastActive: Date.now()
        };
      } else {
        papersData.value[paperId].lastActive = Date.now();
      }
    };

    //   记录用户答案
    const updateUserAnswer = (index, answer) => {
      if (!currentPaperId.value) return;

      papersData.value[currentPaperId.value].userAnswers = {
        ...papersData.value[currentPaperId.value].userAnswers,
        [index]: answer
      };
      papersData.value[currentPaperId.value].lastActive = Date.now();
    };

    const getUserAnswer = (index) => {
      if (!currentPaperId.value) return;

      return papersData.value[currentPaperId.value]?.userAnswers[index];
    };

    //   清理过期的试卷数据
    const cleanupOldData = (maxAge = 30 * 24 * 60 * 60 * 1000) => {
      const now = Date.now();
      for (const paperId in papersData.value) {
        if (now - papersData.value[paperId].timestamp > maxAge) {
          delete papersData.value[paperId];
        }
      }
    };

    return {
      papersData,
      currentPaperId,
      currentUserAnswers,
      currentCorrectAnswers,
      currentScore,
      setCurrentPaper,
      updateUserAnswer,
      getUserAnswer,
      cleanupOldData
    };
  },
  {
    persist: {
      key: "paperStore"
    }
  }
);
