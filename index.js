
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/app.config");
const reqFlash = require("req-flash");
const session = require("express-session");

const app = express();
const log = console.log;

//Middlewares
const authMiddleware = require("./middlewares/auth.middleware");
const auth_utils = require('./utils/auth_utils');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: config.secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge:60000, secure: false, httpOnly: true },
}));
app.use(reqFlash()); 

// app.engine("ejs", require("ejs").renderFile);
// app.set("views", __dirname + "/public/views");
app.set('view engine', 'ejs');

//Start the server
console.clear();
app.listen(config.port, () => console.log(`Server is running http://localhost:${config.port}.`));



app.use(express.static('public'));


app.use("/login", require("./routers/login.router"));
app.use("/signup", require("./routers/signup.router"));

app.get("/",[authMiddleware], (req, res, next) => {
    res.render("index.ejs", {
        user: auth_utils.findUser(req.uid),
    });
});



app.get("/logout", [authMiddleware], (req, res, next) => {
    res.clearCookie("auth_token");
    res.redirect("/login");
});

