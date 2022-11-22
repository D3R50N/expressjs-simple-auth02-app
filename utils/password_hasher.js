const bcrypt = require('bcrypt');

const salt = bcrypt.genSaltSync(10);


module.exports = {
    salt: salt,
    crypt: (password) => {
        return bcrypt.hashSync(password, salt);
    },
    compare: (password, hash) => {
        return bcrypt.compare(password, hash);
    }
};

