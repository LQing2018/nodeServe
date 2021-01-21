// @ts-nocheck
// （1）引入node 内置的 http 模块
const httpModule = require("http");

// （2）创建http服务器 
const server =  httpModule.createServer()

// （3）监听窗口

server.on('request',function(req,res){
    console.log("访问服务器");
    // http 的响应头  告诉浏览器及格式
    // node.js 可以读取文件并传回客户端
    res.write("ok");
    res.end();
})

// （4） 绑定 端口号：
server.listen("8888",function () {
    console.log('服务器启动成功，地址：http://localhost:8888');
})