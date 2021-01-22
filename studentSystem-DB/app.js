//引入的依赖包
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// 引入配置的请求路由文件
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studetsRouter = require('./routes/students');

//公共链接数据库提出来，   

const dbUtils = require("./dao/dbUtils");
var app = express();

// view engine setup 设置模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// 挂在的 第三方的插件 
app.use(logger('dev'));    //日志挂在在 app 内

// 客户端请求的  get post 等格式
app.use(express.json());    //客户端发的请求 数据格式的处理
app.use(express.urlencoded({ extended: false })); //客户端发的请求链接
app.use(cookieParser());  // cookie 的解析处理
app.use(express.static(path.join(__dirname, 'public')));  // 静态资源的处理



// 请求地址 映射的路由文件
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/student', studetsRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
app.listen("8889",function () {
  console.log('服务器启动成功，地址：http://localhost:8889');
})