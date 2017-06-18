/**
 * 自定义路由
 * Created by {{username}} on {{created}}.
 */
module.exports = (router) => {
    router.{{method}}('{{{url}}}', (ctx) => {
        ctx.body = { message: 'Hello, ibird!' };
    });
};