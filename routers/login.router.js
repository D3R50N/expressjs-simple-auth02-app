const express = require('express');
const password_hasher = require('../utils/password_hasher');
const routes = express.Router();
const log = console.log;
const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const authmiddleware = require("../middlewares/auth.middleware");

routes.get("/", [authmiddleware], (req, res, next) => {
    if (req.username) return res.redirect('/');
    res.render("login.ejs");
    next();
}); 


routes.post("/", (req, res, next) => {
    if (req.body.password == undefined || req.body.email == undefined || req.body.password.toString().trim() == "" || req.body.email.toString().trim() == "") {
      return  res.redirect('back');
    }
    
    password_hasher.compare(req.body.password, "$2b$10$J8OmV/KIVZNCYp2b9.IrWulrlG3Wf7lyQZUtHjxbQSzcgrnRniLs.").then((result) => {
        if (result) {
            res.cookie(
                "auth_token",
                jwt.sign(
                    {
                        username: "hello world",
                    },
                    config.secret_key,
                    {
                        expiresIn: 10000,
                    }), 
                {
                    // secure: true,
                    httpOnly : true,
                }
            );
            res.redirect("/");
        } else {
            res.redirect("/login");
        }
    });
    // next();
});
module.exports = routes;