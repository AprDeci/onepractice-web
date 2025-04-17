import { defineStore } from "pinia";
import { ref } from "vue";
export const useUtilStore = defineStore("utilstore", () => {
  const dictionaryMode = ref(false);

  return {
    dictionaryMode
  };
});
