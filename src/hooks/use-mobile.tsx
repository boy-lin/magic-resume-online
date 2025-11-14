import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * 移动端检测 hooks
 * @returns 是否为移动端设备
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobileRegex =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const hasTouch = "ontouchstart" in window;
      const isMobileDevice = mobileRegex.test(navigator.userAgent) || hasTouch;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return {
    isMobile,
    isUiMobile: isMobile || window.innerWidth < MOBILE_BREAKPOINT,
  };
};
