
//引入koa
const Koa = require('koa');
const Router = require('koa-router')

//实例化koa
const app = new Koa();
const router = new Router()

//配置路由

//匹配任何路由，如果不写next，这个路由被匹配到了就不会继续向下匹配
app.use(async (ctx,next) => {
    console.log("我是一个中间件");
    ctx.body = "第一个koa项1目";
    await next()
})

router.get('/', async (ctx) => {
    ctx.body = "首页"
})
router.get('/admin', async (ctx) => {
    ctx.body = "admin页面"
})
router.get('/news',async (ctx) =>{
    // ctx 上下文 context 包含了request 和 respinse 等信息
    // 返回数据  相当于：原生里面的res.writeHead() res.end()
    ctx.body = "new页面"

    // 在koa2中GET 传值 通过request接收，但是接收的方法有两种：
    // query 和 querystring  query 返回的是格式化好的参数对象   querystring 返回的是请求字符串

    // 从ctx 中读取get 传值
    console.log("------"+ctx.url) // /news?id=1&title=aaa
    console.log(ctx.query);  // { id: '1', title: 'aaa' } 获取的是对象   用的最多的方式      ******推荐
    console.log(ctx.querystring);  // id=1&title=aaa      获取的是一个字符串
    console.log(ctx.request.url);   // /news?id=1&title=aaa
    console.log(ctx.request.query);   // { id: '1', title: 'aaa' } 对象
    console.log(ctx.request.querystring);   // id=1&title=aaa
})

router.get('/article/:id', async (ctx) =>{
    ctx.body = "详情页"
    console.log(ctx.url);
    console.log(ctx.params.id);

})

// 启动路由
app.use(router.routes())
app.use(router.allowedMethods())
/**
   router.allowedMethods()作用： 这是官方文档的推荐用法,我们可以
   看到 router.allowedMethods()用在了路由匹配 router.routes()之后,所以在当所有
   路由中间件最后调用.此时根据 ctx.status 设置 response 响应头
   可以配置也可以不配置,建议配置，
   */

//在listen里面写端口号 监听端口
app.listen(3000);