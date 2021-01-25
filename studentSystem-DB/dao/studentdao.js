const studentModel = require("../dao/model/studentModel") 

async function findAll(page,size) {  
    const linumber = Number(size)
    // find 方法是查询所有    skip() 是指从那条数据开始查询  limit() 指定返回多少条
    const students = await studentModel.find().skip(page).limit(linumber)
    // const boo = users.some((item)=>item.username == data.username && item.password == data.password)

    // const students = await studentModel.find({username:{
    //     $regex:/万/
    // }}).skip(page).limit(linumber)

    return students;
} 

module.exports = {
    findAll, 
}