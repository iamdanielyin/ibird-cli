import { assign } from "./utility";
import { IBIRD_ACCESS_TOKEN, IBIRD_CACHETOKEN, IBIRD_USERID } from "../constants/config";
/**
 * 返回默认模型配置
 * @param namespace
 * @param [override] 支持部分覆盖或全覆盖
 */
export function defaultConfig(namespace, override = {}) {
  return assign({
    namespace: namespace,
    state: {
      list: [],
      token: JSON.parse(localStorage.getItem(IBIRD_CACHETOKEN) || '{}'),
      totalpages: 0,
      totalrecords: 0,
      range: 'PAGE',
      sort: '',
      cond: '',
      page: 0,
      size: 20,
      formData: {}
    },
    reducers: {
      refresh(state, { payload: data }){
        return Object.assign({}, state, data);
      },
      formData(state, { payload: formData }){
        return { ...state, formData };
      }
    },
    effects: {
      *reload({ payload: query }, { put, select }) {
        const state = yield select(state => _.pick(state[namespace], 'range', 'sort', 'cond', 'page', 'size'));
        Object.assign(state, query);
        yield put({
          type: 'model/list',
          payload: { key: namespace, query: state, action: `${namespace}/refresh` }
        });
      }
    },
    subscriptions: {
      setup({ dispatch, history }) {
        return history.listen(({ pathname, query }) => {
          if (pathname === `/${namespace}`) {
            dispatch({ type: 'reload', payload: query });
          } else if (pathname === `/${namespace}/form`) {
            if (query._id) {
              dispatch({
                type: 'model/id',
                payload: { key: namespace, id: query._id, action: `${namespace}/formData` }
              });
            } else {
              dispatch({
                type: `formData`,
                payload: {}
              });
            }
          }
        });
      },
    },
  }, override);
}
