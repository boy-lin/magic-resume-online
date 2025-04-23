import mergeWith from "lodash/mergeWith";
import isObject from "lodash/isObject";
import { jsonToUrlParams } from "./url";

const baseURL = process.env.NEXT_PUBLIC_SITE_URL,
  initialConfig = {
    method: "GET",
    params: null,
    body: null,
    headers: {},
    cache: "no-cache",
    credentials: "include",
    responseType: "JSON",
  };

export default function request(url, config?: any) {
  if (typeof url !== "string")
    throw new TypeError("url must be required and of string type");
  // init params
  config = mergeWith(Object.create(initialConfig), config);
  const { method, params, headers, cache, credentials, responseType } = config;
  let body = config.body;

  // 处理URL：请求前缀 & 问号参数
  if (!/^http(s?):\/\//i.test(url)) url = baseURL + url;
  if (params != null) {
    let str = params;
    if (isObject(params)) {
      str = jsonToUrlParams(params);
    } else {
      str = params;
    }
    url += `${url.includes("?") ? "&" : "?"}${str}`;
  }

  // 根据自己的需求来:body传递的是普通对象，我们今天项目需要传递给服务器的是URLENCODED格式，我们才处理它的格式；如果用户传递的本身就不是普通对象(例如:文件流、字符串、FORM-DATA...)，还是以用户自己写的为主...
  if (isObject(body)) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = jsonToUrlParams(body);
  } else if (typeof body === "string") {
    try {
      // 是JSON字符串
      body = JSON.parse(body);
      headers["Content-Type"] = "application/json";
    } catch (err) {
      // 不是JSON字符串:可以简单粗暴的按照URLECCODED格式字符串处理
      headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
  }

  // 把config配置成为fetch需要的对象
  config = {
    method: method.toUpperCase(),
    headers,
    credentials,
    cache,
  };
  if (/^(POST|PUT|PATCH)$/i.test(method) && body != null) config.body = body;

  // 发送请求
  return fetch(url, config)
    .then((response) => {
      let { status, statusText } = response;
      // 只要状态码是以2或者3开始的，才是真正的获取成功
      if (status >= 200 && status < 400) {
        let result;
        switch (responseType.toUpperCase()) {
          case "JSON":
            result = response.json();
            break;
          case "TEXT":
            result = response.text();
            break;
          case "BLOB":
            result = response.blob();
            break;
          case "ARRAYBUFFER":
            result = response.arrayBuffer();
            break;
        }
        return result;
      }
      return Promise.reject({
        code: "STATUS ERROR",
        status,
        statusText,
      });
    })
    .catch((reason) => {
      if (reason && reason.code === "STATUS ERROR") {
        // @1 状态码错误
        switch (reason.status) {
          case 400:
            // ...
            break;
          case 401:
            // ...
            break;
          case 404:
            // ...
            break;
        }
      } else {
        // @3 请求被终止
      }
      return Promise.reject(reason);
    });
}
