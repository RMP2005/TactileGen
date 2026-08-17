export const haptics = {
  lineCross: () => navigator.vibrate?.(15),
  regionEnter: () => navigator.vibrate?.([20, 10, 20]),
  labelHover: () => navigator.vibrate?.(30),
};
