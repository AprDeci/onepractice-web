export const types = ["CET-4", "CET-6"];

export const getPaperdifficult = (rating: number) => {
  // 1-2 easy 3-4 medium 4-5 hard
  if (rating <= 2) {
    return "Beginner";
  } else if (rating < 4) {
    return "Intermediate";
  } else {
    return "Advanced";
  }
};
