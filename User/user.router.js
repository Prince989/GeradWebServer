const router = require("express").Router();
const { checkToken } = require("../../Auth/token_validation");
const {
    getDefault,
    fabricList,
    liningList,
    buttonList,
    setRender
} = require("./user.controller");

router.get("/api/default/fetch/all", getDefault);
router.get("/api/fabric/list", fabricList);
router.get("/api/lining/list", liningList);
router.get("/api/button/list", buttonList);
router.get("/api/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);


module.exports = router;