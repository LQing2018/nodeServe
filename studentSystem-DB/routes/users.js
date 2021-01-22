var express = require('express');
var router = express.Router();

const {login} = require('../service/userService')
/* GET users listing. */
router.get('/login',async function(req, res, next) {
  // res.send('respond with a resource');
  // 获取客户端传递过来的 参数  req.body  ==== post 请求
  // get ==== req.query
  const {username,password} = req.query;
  const value = await login({username,password})
  res.send(value);
});

module.exports = router;
