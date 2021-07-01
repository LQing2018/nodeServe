const Router = require('koa-router');

const errorPage = new Router();

errorPage.get('/', async (ctx) => {
    ctx.body = "访问页面不存在";
})

module.exports = errorPage;