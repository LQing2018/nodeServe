const mongoose = require("mongoose")

//定义一个约束文件

let studentSchema = new mongoose.Schema({
    username:String,
    age:Number,
    address:String,
    birthday:Date,
    gender:String,
    phone:String,
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"classes"
    }
})
// 用这个约束操作哪个表
// 有三个参数。 1.模型的名字  2. 约束的名字  3. 集合的名字(表名)
const studentModel = mongoose.model("student",studentSchema,"students")
module.exports = studentModel;