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
const fs = require('fs');

routes.get("/", [authmiddleware], (req, res, next) => {
    if (req.username) return res.redirect('/');
    res.render("signup.ejs", { last_error: req.flash(namespace.last_error) });
    next();
});


routes.post("/", (req, res, next) => {
    if (nullOrUndefined(req.body.password) || nullOrUndefined(req.body.name) || nullOrUndefined(req.body.email)) {
        req.flash(namespace.last_error, "Please fill all field in this form");
        return res.redirect('back');
    }
    let exist_user;
    for (const key in db.users()) {
        if (Object.hasOwnProperty.call(db.users(), key)) {
            const element = db.users()[key];
            if (element.email == req.body.email) {
                exist_user = element;
            }
        }
    }

    if (exist_user != undefined) {
        req.flash(namespace.last_error, "Ce mail est déjà pris");
        return res.redirect('back');
    }
    let user = userFromBody(req);
    db.createUser(user);
    
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
    // return res.redirect("back");
   
    // next();
});

function userFromBody(req) {
    req.body.password = password_hasher.crypt(req.body.password)
    let { name, password, email } = req.body;

    let user = {uid:require("randomstring").generate(), name, password, email };
    
    return user;
}

module.exports = routes;
