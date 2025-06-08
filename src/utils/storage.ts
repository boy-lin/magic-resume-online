import { isRememberKey, userEmailKey } from "@/config/key";
/**
 * obj 转成字符串 写入local
 * @param {*} name
 * @param {*} obj
 */
export const setLocalStorageByName = (
  name: string,
  value: any,
  needEncode = false
) => {
  if (typeof window == "undefined") return;

  if (!name || !value) {
    console.warn(
      `setLocalStorageByName name=${name}, value=${value};参数有错误`
    );
    return null;
  }
  localStorage.setItem(
    name,
    needEncode ? encodeURIComponent(JSON.stringify(value)) : value
  );
  return value;
};

/**
 * 根据 name 获取缓存字符串并转换成对象
 * @param {*} name
 */
export const getLocalStorageByName = (name: string, needParse = false) => {
  if (typeof window == "undefined") return;

  const shareData = localStorage.getItem(name) || "";
  try {
    if (!needParse) return shareData;
    return JSON.parse(decodeURIComponent(shareData));
  } catch (e) {
    return shareData;
  }
};

export const clearLocalStorage = () => {
  const isRemember = localStorage.getItem(isRememberKey);
  const userEmail = localStorage.getItem(userEmailKey);
  localStorage.clear();
  if (isRemember) localStorage.setItem(isRememberKey, isRemember);
  if (userEmail) localStorage.setItem(userEmailKey, userEmail);
};
