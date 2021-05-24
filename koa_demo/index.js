//引入koa
const Koa = require('koa');
const Router = require('koa-router')
//实例化koa
const app = new Koa();
const router = new Router()
//配置路由
router.get('/', async (ctx) => {
    ctx.body = "首页"
})
router.get('/admin', async (ctx) => {
    ctx.body = "admin页面"
})
router.get('/news',async (ctx) =>{
    ctx.body = "new页面"
})
app.use(router.routes())
app.use(router.allowedMethods())
/**
   router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
   看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
   路由中间件最后调用.此时根据 ctx.status 设置 response 响应头
   可以配置也可以不配置,建议配置，
   */
// app.use(async ctx => {
//     ctx.body = "第一个koa项1目";
// })
//在listen里面写端口号 监听端口
app.listen(3000);