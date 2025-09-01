export const getFlexDirection = (layout: string) => {
  if (layout === "center") {
    return "column";
  }
  return "row";
};

export const getAlignItems = (layout: string) => {
  if (layout === "center") {
    return "center";
  }
  return "flex-start";
};
