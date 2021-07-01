const Router = require('koa-router')

const list = new Router()

list.get('/', async (ctx, next) => {
    ctx.body = "列表页"
    await next()
})

list.get('/jiankang', async (ctx, next) => {
    ctx.body = "健康"
    await next()
})

list.get('/pingan', async (ctx, next) => {
    ctx.body = "平安"
    await next()
})
module.exports = list