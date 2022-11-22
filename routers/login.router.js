const express = require('express');
const password_hasher = require('../utils/password_hasher');
const routes = express.Router();
const log = console.log;
const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const authmiddleware = require("../middlewares/auth.middleware");
const db = require('../db');
const namespace = require("../lib/namespace");
const { nullOrUndefined } = require('../utils/functions');

const users = db.users();

routes.get("/", [authmiddleware], (req, res, next) => {
    if (req.username) return res.redirect('/');
    // cookies.last_error
    res.render("login.ejs", { last_error: req.flash(namespace.last_error) });
    next();
});


routes.post("/", (req, res, next) => {
    if (nullOrUndefined(req.body.password) || nullOrUndefined(req.body.email)) {
        req.flash(namespace.last_error, "Please fill all field in this form");
        return res.redirect('back');
    }
    let user;
    for (const key in users) {
        if (Object.hasOwnProperty.call(users, key)) {
            const element = users[key];
            if (element.email == req.body.email) {
                user = element;
            }
        }
    }

    if (user == undefined) {
        req.flash(namespace.last_error, "Cet utilisateur n'existe pas");
        return res.redirect('back');
    }
    password_hasher.compare(req.body.password, user.password).then((result) => {
            if (result) {
                res.cookie(
                    "auth_token",
                    jwt.sign(
                        {
                            uid: user.uid,
                        },
                        config.secret_key,
                        {
                            expiresIn: 10000,
                        }),
                    {
                        // secure: true,
                        httpOnly: true,
                    }
                );
                res.redirect("/");
            } else {
                req.flash(namespace.last_error, "Invalid password");
                res.redirect("/login");
            }
        });
    // next();
});
module.exports = routes;