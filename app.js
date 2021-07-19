require("dotenv").config();
const express = require("express");
const app = express();
var cors = require('cors');
const userRouter = require("./api/user/user.router");
const adminRouter = require("./api/admin/admin.router");
const fileUpload = require('express-fileupload');

app.use(express.json());
app.use(cors());
let options = {
    redirect: false
}
app.use(express.static('public', options));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const port = 8085;

app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});