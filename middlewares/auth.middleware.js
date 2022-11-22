
const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const express = require('express');
const routes = express.Router();
const log = console.log;
const fs = require("fs");
const password_hasher = require("../utils/password_hasher");
const db = require("../db");


function checkIfHasToken(req, res, next) {
    // config.password_hasher.crypt.hashSync(req.body.password, config.password_hasher.salt)
    // $2b$10$J8OmV/KIVZNCYp2b9.IrWulrlG3Wf7lyQZUtHjxbQSzcgrnRniLs.
    // log(jwt.sign({ username: "hello world", userpassword: config.password_hasher.crypt.hash() }, config.secret_key, {
    //     expiresIn: 10000,
    // }))
    if (!req.cookies) {
        return res.status(401).send("It seems that your browser does not support cookies. Please enable cookies and try again.");
    }


    if (!req.cookies.auth_token && req.originalUrl !== "/login" && req.originalUrl !== "/signup") {
        return res.redirect("/login"); 
    }

    next();
};
function verifyAuthToken(req, res, next) {

    if (req.cookies.auth_token) {
        jwt.verify(req.cookies.auth_token, config.secret_key, (err, payload) => {
            if (err) {
                //?fs.writeFileSync("lib/error-" + Date.now() + ".json", JSON.stringify(err));
                res.cookie("last_error", err.message, {
                    expires: 0,
                });
                return res.clearCookie('auth_token').redirect("/");
            }
            if (payload) {
                req.uid = payload.uid;
                next();
            }
        });
    }
    next();
}


routes.use([checkIfHasToken, verifyAuthToken]);

module.exports = routes;
