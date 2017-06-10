import * as modelService from "../services/model";

export default {
  namespace: 'model',
  state: {},
  reducers: {},
  effects: {
    *list({ payload: { key, query, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.list, key, query);
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action, payload: data });
        if (typeof backup === 'function') backup();
      }
    },
    *one({ payload: { key, cond, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.one, key, cond);
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action, payload: data });
        if (typeof backup === 'function') backup();
      }
    },
    *id({ payload: { key, id, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.id, key, id);
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action, payload: data });
        if (typeof backup === 'function') backup();
      }
    },
    *remove({ payload: { key, cond, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.remove, key, null, { cond });
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action });
        if (typeof backup === 'function') backup();
      }
    },
    *update({ payload: { key, cond, doc, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.update, key, null, { cond, doc });
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action });
        if (typeof backup === 'function') backup();
      }
    },
    *create({ payload: { key, doc, action, backup } }, { call, put }) {
      const { data, errcode, errmsg } = yield call(modelService.create, key, null, doc);
      if (!errcode && !errmsg) {
        if (action) yield put({ type: action });
        if (typeof backup === 'function') backup();
      }
    }
  },
  subscriptions: {},
};
