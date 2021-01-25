const userModel = require("../dao/model/userModel")
async function findUser(data) {
    const users = await userModel.find(data)
    // const boo = users.some((item)=>item.username == data.username && item.password == data.password)
    return users;
}


module.exports = {
    findUser,
}