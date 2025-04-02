import { defineStore } from "pinia";
import { ref } from "vue";

export const usepaperStore = defineStore("paper", () => {
  const answers = ref({});

  return { answers };
});
