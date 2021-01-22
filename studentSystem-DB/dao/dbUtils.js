
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/studentSystem",{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.connection.on("connected",function () {
    console.log("数据库链接成功");
})