import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { answer } from "../interface/Question";
import { userecordStore } from "./recordStore";

interface paperdata {
  paperId: string;
  userAnswers: answer[] | null;
  correctAnswers: answer[] | null;
  timestamp: number;
}
export const usepaperStore = defineStore(
  "paperStore",
  () => {
    const recordStore = userecordStore();

    // state
    const papersData = ref<Record<number, paperdata>>({}); // 所有试卷数据 { paperId: { userAnswers, correctAnswers, timestamp } }
    const currentPaperId = ref<number | null>(null); // 当前试卷ID
    const currentPaperType = ref<string | null>(null);
    const currentMode = ref<string | null>(null); // 当前模式

    // getter
    const currentUserAnswers = computed(() => {
      if (!currentPaperId.value) return {};
      return papersData.value[currentPaperId.value]?.userAnswers || {};
    });

    const currentCorrectAnswers = computed(() => {
      if (!currentPaperId.value) return {};
      return papersData.value[currentPaperId.value]?.correctAnswers || {};
    });

    const currentTimestamp = computed(() => {
      if (!currentPaperId.value) return 0;
      return papersData.value[currentPaperId.value]?.timestamp || 0;
    });

    //   当前试卷得分
    const currentScore = computed(() => {
      const userAnswers = currentUserAnswers.value;
      const correctAnswers = currentCorrectAnswers.value;

      return Object.keys(userAnswers).reduce((score, index) => {
        return score + (userAnswers[index] === correctAnswers[index] ? 1 : 0);
      }, 0);
    });

    // 记录用户答案正确错误

    const currentAnswerStatus = computed(() => {
      const userAnswers = currentUserAnswers.value;
      const correctAnswers = currentCorrectAnswers.value;

      return Object.keys(userAnswers).reduce((acc, index) => {
        acc[index] = userAnswers[index] === correctAnswers[index];
        return acc;
      }, {});
    });

    const currentCorrectAnswersLength = computed(() => {
      return Object.keys(currentCorrectAnswers.value).length;
    });

    const currentUserAnswersLength = computed(() => {
      return Object.keys(currentUserAnswers.value).length;
    });
    //   设置当前试卷正确答案 初始化
    // 初始化
    const setCurrentPaper = (paperId, correctAnswers) => {
      currentPaperId.value = paperId;

      // 之前没有值 进入试卷 (不可能没值 从paperinfo/userinfo)
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
      } else if (!papersData.value[paperId].correctAnswers) {
        // 缓存删除 从历史记录进入 已经设置好useranswers
        papersData.value[paperId].correctAnswers = correctAnswers.reduce((acc, item) => {
          acc[item.index] = item.answer;
          return acc;
        }, {});
        papersData.value[paperId].timestamp = Date.now();
        papersData.value[paperId].lastActive = Date.now();
      } else {
        // 之前有值 重新进入试卷
        papersData.value[paperId].lastActive = Date.now();
      }
    };
    // 当前试卷类型
    const setCurrentPaperType = (paperType: string) => {
      currentPaperType.value = paperType;
    };

    // 设置用户做题答案
    const setUserAnswer = (paperId, answer) => {
      if (!papersData.value[paperId]) {
        papersData.value[paperId] = {
          userAnswers: answer
        };
      } else {
        papersData.value[paperId].userAnswers = answer;
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

    const setCurrentMode = (mode: string) => {
      currentMode.value = mode;
    };

    //   清理过期的试卷数据
    const cleanupOldData = (maxAge = 2 * 60 * 60 * 1000) => {
      const now = Date.now();
      for (const paperId in papersData.value) {
        if (now - papersData.value[paperId].timestamp > maxAge) {
          delete papersData.value[paperId];
          // 删除对应record
          delete recordStore.records[paperId];
        }
      }
    };

    const cleancurrentUserAnswer = () => {
      if (!currentPaperId.value) return;
      papersData.value[currentPaperId.value].userAnswers = {};
      // 刷新时间戳->刷新组件
      papersData.value[currentPaperId.value].timestamp = Date.now();
    };

    const cleanAll = () => {
      papersData.value = {};
      currentPaperId.value = null;
    };

    return {
      papersData,
      currentPaperId,
      currentMode,
      currentUserAnswers,
      currentCorrectAnswers,
      currentScore,
      currentAnswerStatus,
      currentUserAnswersLength,
      currentCorrectAnswersLength,
      currentTimestamp,
      currentPaperType,
      setCurrentPaper,
      setCurrentPaperType,
      setUserAnswer,
      updateUserAnswer,
      getUserAnswer,
      setCurrentMode,
      cleanupOldData,
      cleancurrentUserAnswer,
      cleanAll
    };
  },
  {
    persist: {
      key: "paperStore"
    }
  }
);
