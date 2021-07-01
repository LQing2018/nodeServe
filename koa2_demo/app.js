const koa = require('koa2');

const app = new koa();

const port = 9000;

const router = require('./router');

// 统一处理 请求的状态
const errorHandler = require('./utils/errorHandler.js');

// 匹配不到页面的全部跳转去404


app.use(router.routes());

app.use(router.allowedMethods());

app.use(async (ctx, next) => {
    await next();
    if (parseInt(ctx.status) === 404) {
        ctx.redirect("/404")
    }
})

errorHandler(app);

app.listen(port, () => {
    console.log('Server is running at http://localhost:' + port);
})