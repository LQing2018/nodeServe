const { findUser, addUser } = require("../dao/userdao")
 
// @ts-ignore
module.exports = {

    login(data) {
        const res = findUser(data);
        if (res) {
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