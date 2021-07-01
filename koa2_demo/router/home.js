const Router = require('koa-router')

const home = new Router()
const db = require('../utils/db');

home.get('/', async (ctx, next) => {
    ctx.body = "首页"
    // await next()
    // let data = await new Promise((resolve, reject) => {
    //     let sqlLang = `select * from users`;
    //     db.query(sqlLang, (err, data) => {
    //         if (err) reject(err);
    //         resolve(data); // 返回拿到的数据
    //     })
    // })
    // ctx.body = data;
})

home.get('/banner', async (ctx, next) => {
    ctx.body = "首页 -- 轮播图"
    await next()
})

home.get('/content', async (ctx, next) => {
    ctx.body = "首页 -- content"
    await next()
})
module.exports = home