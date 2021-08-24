const router = require("express").Router();
const {
    getDefault,
    fetchMenu,
    materialList,
    setRender,
    getRender
} = require("./user.controller");

const{
    checkMode,
    checkModes
} = require("../../middlewares/check.mode");

router.get("/fetch/menu",fetchMenu);
router.get("/default/fetch/all", getDefault);
router.get("/:mode/list/fetch",checkMode, materialList);
router.get("/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);
router.post("/fetch/render/:size/:model/:shot",checkModes, getRender);


module.exports = router;