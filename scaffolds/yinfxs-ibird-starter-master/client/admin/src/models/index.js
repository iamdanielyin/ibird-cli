import * as tokenService from "../services/token";
import { message } from "antd";
import { routerRedux } from "dva/router";
import { IBIRD_CACHETOKEN, LOGIN_URI } from "../constants/config";

export default {
  namespace: 'index',
  state: {
    menuCode: null,
    name: null,
    username: null,
    collapsed: false,
    mode: 'vertical'
  },
  reducers: {
    init(state){
      const result = {};
      const data = JSON.parse(localStorage.getItem(IBIRD_CACHETOKEN) || '{}');
      if (data && Object.keys(data).length > 0) {
        const { user, userid } = data;
        Object.assign(result, { username: user.name || user.username || userid });
      }
      return Object.assign({}, state, result);
    },
    collapse(state, { payload: { collapsed } }){
      return { ...state, collapsed, mode: collapsed ? 'vertical' : 'inline' };
    }
  },
  effects: {
    *validity({ payload }, { call, put }) {
      const { errcode, errmsg } = yield call(tokenService.validity);
      if (errcode || errmsg) {
        message.error(errmsg);
        yield put(routerRedux.push(LOGIN_URI))
      } else {
        yield put({ type: 'init' });
        if (payload && payload.action) {
          const { action, data = {} } = payload;
          yield put({ type: action, payload: { data } });
        }
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === LOGIN_URI) return;
        dispatch({ type: 'validity' });
      });
    }
  }
};
