/**
 * obj 转成字符串 写入local
 * @param {*} name
 * @param {*} obj
 */
export const setLocalStorageByName = (name: string, value: any) => {
  if (typeof window == 'undefined') return

  if (!name || !value) {
    console.warn(`setLocalStorageByName name=${name}, value=${value};参数有错误`)
    return null
  }
  localStorage.setItem(name, encodeURIComponent(JSON.stringify(value)))
  return value
}

/**
 * 根据 name 获取缓存字符串并转换成对象
 * @param {*} name
 */
export const getLocalStorageByName = (name: string) => {
  if (typeof window == 'undefined') return

  const shareData = localStorage.getItem(name) || ''
  try {
    return JSON.parse(decodeURIComponent(shareData))
  } catch (e) {
    return shareData
  }
}
