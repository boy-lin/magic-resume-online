export function debounce(fun: Function, interval: number) {
  let timer: any;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fun.apply(args);
      timer = null;
    }, interval);
  };
}
