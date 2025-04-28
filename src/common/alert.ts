import { ref } from "vue";

const alertRef = ref<any>(null);

export const useAlert = () => {
  const showAlert = (
    text: string,
    type: "success" | "error" | "warning" | "info" = "success",
    duration = 3000
  ) => {
    if (alertRef.value) {
      alertRef.value.addMessage(text, type, duration);
    }
  };

  return {
    alertRef,
    showAlert
  };
};
