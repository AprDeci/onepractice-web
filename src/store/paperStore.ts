import { defineStore } from "pinia";
import { ref } from "vue";

export const usepaperStore = defineStore("paper", () => {
  const currentPaperAnswer = ref({});

  return { currentPaperAnswer };
});
