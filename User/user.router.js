const router = require("express").Router();
const { checkToken } = require("../../Auth/token_validation");
const {
    getDefault,
    fabricList,
    liningList,
    buttonList,
    setRender
} = require("./user.controller");

router.get("/", checkToken, getUsers);

module.exports = router;