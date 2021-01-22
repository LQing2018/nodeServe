const { findUser, addUser } = require("../dao/userdao")
 
// @ts-ignore
module.exports = {

   async login(data) {
        const res = await findUser(data);
        if (res.length > 0) {
            return {
                success:res,
                msg:"登录成功"
            }
        } else {
            return {
                success:res,
                msg:"登录失败"
            }
        }
    }
}