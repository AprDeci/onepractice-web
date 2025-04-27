import { defineStore } from "pinia";
import { ref } from "vue";
export const useUtilStore = defineStore(
  "utilstore",
  () => {
    const dictionaryMode = ref(false);

    const markcolor = ref("255, 158, 215");

    const colors = [
      {
        value: "255, 158, 215",
        color: "#ff9ed7",
        label: "pink"
      },
      {
        value: "127, 209, 215",
        color: "#7fd1d7",
        label: "Breeze"
      },
      {
        value: "255, 248, 235",
        color: "#fff8eb",
        label: "cream"
      }
    ];

    return {
      dictionaryMode,
      markcolor,
      colors
    };
  },
  {
    persist: {
      pick: ["markcolor"]
    }
  }
);
