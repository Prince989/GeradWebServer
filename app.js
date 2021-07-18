require("dotenv").config();
const express = require("express");
const app = express();
const userRouter = require("./api/user/user.router");
app.use(express.json());

app.use("/api/user", userRouter);
const port = 8085;
app.listen(port, () => {
    console.log("server up and running on PORT :", port);
});