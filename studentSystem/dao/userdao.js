const users = [{
    _id: '1',
    username: 'admin',
    password: '123'
}, {
    _id: '2',
    username: 'seller',
    password: '123'
}]


function findUser(data) {
    const boo = users.some((item)=>item.username == data.username && item.password == data.password)
    return boo;
}

function addUser(data) {
    const boo = users.some((item)=>{
        item.username == data.username && item.password == data.password
    })
    return boo;
}

module.exports = {
    findUser,
    addUser
}