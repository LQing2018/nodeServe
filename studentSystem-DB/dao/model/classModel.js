const mongoose = require("mongoose") 
//定义一个约束文件

let classSchema = new mongoose.Schema({
    className:String,
    state:Number,
    type:String,
})
// 用这个约束操作哪个表
// 有三个参数。 1.模型的名字  2. 约束的名字  3. 集合的名字(表名)
const classModel = mongoose.model("classes",classSchema,"classes")
module.exports = classModel;