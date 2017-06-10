import * as tokenService from "../services/token";
import { message } from "antd";
import qs from "qs";
import { routerRedux } from "dva/router";
import {
  IBIRD_ACCESS_TOKEN,
  IBIRD_CACHETOKEN,
  IBIRD_USER_INFO,
  IBIRD_USERID,
  LOGIN_URI,
  REDIRECT_URI
} from "../constants/config";

export default {
  namespace: 'login',
  state: {
    token: null,
    user: null,
    username: null,
    password: null
  },
  reducers: {
    init(state, {}){
      // 获取记住的账号信息
      const userinfo = JSON.parse(localStorage.getItem(IBIRD_USER_INFO) || '{}');
      if (!userinfo || Object.keys(userinfo).length == 0) return { ...state };
      return Object.assign({}, userinfo);
    },
    error(state, { payload }){
      return { ...state, payload };
    },
    refresh(state, { payload }){
      return { ...state, payload };
    }
  },
  effects: {
    *signin({ payload: values }, { call, put }) {
      const { data, errcode, errmsg } = yield call(tokenService.signin, values, function () {
        message.error('抱歉，账号不存在或账号密码不匹配');
      });
      if (errcode || errmsg) {
        yield put({ type: 'error', payload: { errcode, errmsg } });
      } else {
        message.success('登录成功！');
        const { token, userid } = data;
        const { access_token } = token;
        if (localStorage) {
          localStorage.setItem(IBIRD_CACHETOKEN, JSON.stringify(data, null, 0));
        }

        if (values.remember === true && localStorage) {
          localStorage.setItem(IBIRD_USER_INFO, JSON.stringify(values, null, 0));
        } else {
          localStorage.removeItem(IBIRD_USER_INFO);
        }

        if (!REDIRECT_URI) return message.error('主页配置异常');
        if (REDIRECT_URI.startsWith('http')) {
          location.href = `${REDIRECT_URI}?${qs.stringify({ access_token, userid })}`;
        } else {
          yield put(routerRedux.push(REDIRECT_URI))
        }
      }
    },
    *signout({}, { call, put }) {
      yield call(tokenService.signout, () => {
        console.log('登出成功...');
      });
      if (localStorage) localStorage.removeItem(IBIRD_CACHETOKEN);
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/login') {
          dispatch({ type: 'init' });
        }
      });
    }
  }
};
