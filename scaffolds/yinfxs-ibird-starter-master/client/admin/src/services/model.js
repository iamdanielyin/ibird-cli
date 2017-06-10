/**
 * 通用接口操作模块
 * Created by yinfxs on 2017/5/7.
 */

import request from "../utils/request";
import qs from "qs";
import { PREFIX, REQUEST_DEFAULT_OPTIONS } from "../constants/config";
import { MENU } from "../constants/api";

/**
 * 地址处理
 * @param url
 */
export function urlfix(url) {
  if (!url || url.startsWith('http')) return url;
  if (url.startsWith('/')) {
    return url.startsWith(PREFIX) ? url : `${PREFIX}${url}`;
  }
  return `${PREFIX}/${url}`;
}
/**
 * 获取默认列表查询接口
 * @param url
 * @param params
 * @returns {Object}
 */
export function list(url, params = {}, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}?${qs.stringify(params)}`, REQUEST_DEFAULT_OPTIONS, errcall);
}

/**
 * 获取默认单个查询接口
 * @param url
 * @param params
 * @returns {Object}
 */
export function one(url, params = {}, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}?${qs.stringify(params)}`, REQUEST_DEFAULT_OPTIONS, errcall);
}


/**
 * 获取默认ID查询接口
 * @param url
 * @returns {Object}
 */
export function id(url, id, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}/${id}`, REQUEST_DEFAULT_OPTIONS, errcall);
}

/**
 * 获取默认新增接口
 * @param url
 * @param query
 * @param body
 * @returns {Object}
 */
export function create(url, query = {}, body = {}, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}?${qs.stringify(query)}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'POST',
    body: JSON.stringify(body, null, 0)
  }), errcall);
}

/**
 * 获取默认修改接口
 * @param url
 * @param query
 * @param body
 * @returns {Object}
 */
export function update(url, query = {}, body = {}, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}?${qs.stringify(query)}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'PUT',
    body: JSON.stringify(body, null, 0)
  }), errcall);
}

/**
 * 获取默认删除接口
 * @param url
 * @param query
 * @param body
 * @returns {Object}
 */
export function remove(url, query = {}, body = {}, errcall) {
  // 调用登录接口
  return request(`${urlfix(url)}?${qs.stringify(query)}`, Object.assign({}, REQUEST_DEFAULT_OPTIONS, {
    method: 'DELETE',
    body: JSON.stringify(body, null, 0)
  }), errcall);
}


