require("dotenv").config();
const express = require("express");
const app = express();
var cors = require('cors');
const userRouter = require("./api/user/user.router");
const adminRouter = require("./api/admin/admin.router");
const authRouter = require("./api/auth/login/login.router");
const fileUpload = require('express-fileupload');

app.use(express.json({limit: '50mb'}));
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type','authorization'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));
let options = {
    redirect: false
}
app.use(express.static('public', options));
// app.use(express.bodyParser({limit: '50mb'}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth",authRouter);
const port = 33140;

const JDate = require('jalali-date');


app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});