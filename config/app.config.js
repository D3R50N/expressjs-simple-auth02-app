require('dotenv').config();
const fs = require('fs');
const config = {
    port: parseInt(process.env.PORT || 3000),
    secret_key: fs.readFileSync("public.pem").toString(),
};

module.exports = config;