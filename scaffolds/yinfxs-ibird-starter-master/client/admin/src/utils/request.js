import fetch from "dva/fetch";
import { message } from "antd";

/**
 * JSON处理
 * @param response
 */
function json(response) {
  return response.json();
}

/**
 * 状态检测
 * @param response
 * @returns {*}
 */
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * 执行请求，返回Promise实例
 *
 * @param  {string} url 请求地址
 * @param  {object} [options] 请求参数
 * @param  {object} [errcall] 自定义异常提示处理函数
 * @return {object}
 */
export default function request(url, options = {}, errcall) {
  Object.assign(options, { credentials: 'same-origin' });
  return fetch(url, options)
  .then(status)
  .then(json)
  .then((data) => {
    //错误检测
    if (data.errmsg) {
      if (typeof errcall === 'function') {
        errcall(data);
      } else {
        message.error(data.errmsg);
      }
    }
    return data;
  })
  .catch(err => ({ err }));
}
