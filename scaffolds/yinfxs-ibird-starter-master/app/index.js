/**
 * 应用入口文件
 * Created by yinfxs on 2017/6/5.
 */

const _ = require('lodash');
const path = require('path');
const task = require('ibird-task');
const raml = require('ibird-raml');
const app = require('ibird-core');
const docs = require('ibird-docs');
const token = require('ibird-token');
const log = require('ibird-log');
const mongoose = require('mongoose');
const moment = require('moment');
const config = require(`../config/environments/${process.env.IBIRD_ENV}.js`);
const logger = log.config({ name: config.name, hostname: config.hostname });
moment.locale('zh-cn');

// 令牌配置
token.config({
    mode: token.MODE_REDIS,
    redis: config.redis,
    condition: (ctx) => {
        const obj = _.pick(ctx.request.body, 'username', 'password');
        const User = mongoose.model('User');
        return User.findOne(obj);
    }
});
// 项目配置
app.config(Object.assign(
    {
        static: {
            '/admin': path.resolve(__dirname, '../client/admin/dist'),
            '/public': path.resolve(__dirname, '../public')
        },
        logger,
        prefix: '/api/v1',
        cross: true
    }, config
));
// 挂载中间件目录
app.useDir(path.resolve(__dirname, 'middleware'));
// 挂载数据模型目录
app.modelDir(path.resolve(__dirname, 'models'));
// 挂载自定义路由目录
app.mountDir(path.resolve(__dirname, 'routes'));
// 挂载调度任务目录
app.mountDir(path.resolve(__dirname, 'tasks'));
// 引用插件
app.import(token);
// 启动项目
app.start().then(() => {
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}：服务端启动成功，本地访问地址 http://127.0.0.1:${app.config().port}！`);
});