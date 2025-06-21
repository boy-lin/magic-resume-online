export function throttle(fun: FunctionConstructor, interval: number) {
  let latestStamp = 0;
  return function () {
    const nowStamp = Date.now();
    if (nowStamp - latestStamp >= interval) {
      // eslint-disable-next-line prefer-rest-params
      fun.apply(arguments);
      latestStamp = nowStamp;
    }
  };
}
