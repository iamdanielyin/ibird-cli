let _cache = null;

/**
 * 缓存应用对象
 * @param app
 */
export function cache(app) {
  _cache = app;
}

/**
 * 获取应用对象
 * @returns {*}
 */
export function get() {
  return _cache || {};
}


/**
 * 获取应用对象
 * @returns {*}
 */
export function _dispatch() {
  return _cache && _cache._store ? _cache._store.dispatch : null;
}
