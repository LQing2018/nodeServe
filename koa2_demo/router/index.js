const Router = require('koa-router')
const router = new Router();
const list = require("./list")
const home = require("./home")
const errorPage = require("./errorPage")
// router.get('/', async (ctx, next) => {
//     ctx.body = "首页"
// })
router.use('/home', home.routes(), home.allowedMethods())
router.use('/list', list.routes(), list.allowedMethods())
router.use('/404', errorPage.routes(), errorPage.allowedMethods())

router.redirect('/', '/home');

module.exports = router