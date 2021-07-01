const router = require("koa-router")

router.get('/',async ctx =>{
    ctx.body = "admin管理页面"
})
router.get('',async ctx =>{
    ctx.body = "我是user页面"
})
module.exports = router