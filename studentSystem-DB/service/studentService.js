const {findAll} = require("../dao/studentdao")

// @ts-ignore
module.exports = { 
    async findAllstudent(page,size) {

        const page1 = (page-1)*size
         const res = await findAll(page1,size);
         if (res.length > 0) {
             return {
                 data:res,
                 msg:"查询成功"
             }
         } else {
             return {
                 data:res,
                 msg:"查询失败"
             }
         }
     }
 }