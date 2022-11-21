
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/app.config");
const authMiddleware = require("./middlewares/auth.middleware");

const log = console.log;
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
// app.engine("ejs", require("ejs").renderFile);
// app.set("views", __dirname + "/public/views");
app.set('view engine', 'ejs');

//Start the server
console.clear();
app.listen(config.port, () => console.log(`Server is running on port ${config.port}.`));


app.use(express.static('public'));


app.use("/login", require("./routers/login.router"));

app.get("/",[authMiddleware], (req, res, next) => {
    res.send(req.username);
});


