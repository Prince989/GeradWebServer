const router = require("express").Router();
const {
    getDefault,
    fabricList,
    liningList,
    buttonList,
    setRender
} = require("./user.controller");

router.get("/default/fetch/all", getDefault);
router.get("/fabric/list/fetch", fabricList);
router.get("/lining/list/fetch", liningList);
router.get("/button/list/fetch", buttonList);
router.get("/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);


module.exports = router;