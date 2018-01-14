/**
 * 模块导出
 * {{description}}
 * Author: {{author}}
 * Date: {{date}}
 */

const ctx = {};
const namespace = '{{namespace}}';

/**
 * 国际化配置
 */
const locales = {
  "zh_CN": {
    "locale": "简体中文",
    "hello": "你好"
  },
  "zh_TW": {
    "locale": "繁體中文",
    "hello": "你好"
  },
  "en_US": {
    "locale": "English",
    "hello": "Hello"
  }
}

/**
 * 加载回调
 * @param {Object} app - 应用实例
 * @param {Object} options - 引用选项
 */
function onload(app, options) {
  Object.assign(ctx, { app, options });
  const config = app.c();
  app.info(config.name);
  app.info(app.getLocaleString('locale'));
  app.info(app.getLocaleString('hello'));
}

/**
 * 启动回调
 * @param {Object} app - 应用实例
 */
function onplay(app) {
  const config = app.c();
  app.info(config.name);
}

/**
 * 插件API
 */
const api = {
  hello: function () {
    return new Date().toLocaleString();
  },
};

/**
 * 插件路由
 */
const routes = {
  'ping': {
    name: 'ping',
    method: 'GET',
    path: '/ping',
    middleware: async ctx => {
      ctx.body = { data: 'Hello World!' };
    }
  }
};

/**
 * 插件中间件
 */
const middleware = {
  'randomNumber': async (ctx, next) => {
    ctx.random = Math.random();
    next();
  }
};

module.exports = {
  namespace,
  locales,
  onload,
  onplay,
  api,
  routes,
  middleware
}