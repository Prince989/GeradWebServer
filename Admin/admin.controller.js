const {
    getDefault,
    fabricList,
    buttonList,
    setRender
} = require("./user.service");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

