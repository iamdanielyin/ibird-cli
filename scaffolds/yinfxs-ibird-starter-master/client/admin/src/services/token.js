/**
 * 登录服务模块
 * Created by yinfxs on 2017/5/6.
 */
import request from "../utils/request";
import md5 from "blueimp-md5";
import { PREFIX, REQUEST_DEFAULT_OPTIONS } from "../constants/config";
import { REFRESH, SIGNIN, SIGNOUT, VALIDITY } from "../constants/api";

/**
 * 执行登录
 * @param username 用户名
 * @param password 密码（明文）
 * @param errcall
 * @returns {Object}
 */
export function signin({ username, password }, errcall) {
  // 密码MD5处理
  password = md5(password).toUpperCase();
  // 调用登录接口
  return request(`${PREFIX}${SIGNIN}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'POST',
    body: JSON.stringify({ username, password }, null, 0),
  }), errcall);
}

/**
 * 刷新令牌
 * @returns {Object}
 */
export function refresh() {
  // 调用登录接口
  return request(`${PREFIX}${REFRESH}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'POST'
  }));
}

/**
 * 退出登录
 * @returns {Object}
 */
export function signout(errcall) {
  // 调用登录接口
  return request(`${PREFIX}${SIGNOUT}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'POST'
  }), errcall);
}


/**
 * 令牌有效性验证
 * @returns {Object}
 */
export function validity() {
  // 调用登录接口
  return request(`${PREFIX}${VALIDITY}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'POST'
  }));
}
