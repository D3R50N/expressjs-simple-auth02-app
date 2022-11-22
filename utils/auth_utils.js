const db = require("../db");


function findUser(id) {
    return db.users()[id];
}


module.exports = {
   findUser
}