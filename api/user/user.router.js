const router = require("express").Router();
const {
    getDefault,
    fetchMenu,
    materialList,
    setRender,
    getRender
} = require("./user.controller");

const{
    checkMode
} = require("../../middlewares/check.mode");

router.get("/fetch/menu",fetchMenu);
router.get("/default/fetch/all", getDefault);
router.get("/:mode/list/fetch",checkMode, materialList);
router.get("/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);
router.get("/fetch/render/:size/:model/:shot", getRender);


module.exports = router;