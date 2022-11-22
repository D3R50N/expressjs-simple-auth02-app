const fs = require("fs");

const users = () => {
    return JSON.parse(fs.readFileSync(__dirname + "/users.json"));
}

const createUser = (user) => {
    let _users = users();
    _users[user.uid] = user;
    fs.writeFileSync(__dirname + "/users.json", JSON.stringify(_users));
}

module.exports = {
    users,
    createUser,
}