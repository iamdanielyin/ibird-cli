/**
 * 应用服务模块
 * Created by yinfxs on 2017/5/7.
 */


import request from "../utils/request";
import qs from "qs";
import { PREFIX, REQUEST_DEFAULT_OPTIONS } from "../constants/config";
import { MENU } from "../constants/api";

/**
 * 获取菜单
 * @param query 查询
 * @returns {Object}
 */
export function menu(query) {
  // 密码MD5处理
  // 调用登录接口
  return request(`${PREFIX}${MENU}?${qs.stringify(query)}`, REQUEST_DEFAULT_OPTIONS);
}
