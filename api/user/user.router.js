const router = require("express").Router();

const {
    getDefault,
    fetchMenu,
    materialList,
    setRender,
    getRender,
    sendCode,
    verifyCode,
    getSize,
    fetchCart
} = require("./user.controller");

const{
    checkMode,
    checkModes,
   
} = require("../../middlewares/check.mode");

router.get("/fetch/menu",fetchMenu);
router.get("/default/fetch/all", getDefault);
router.get("/:mode/list/fetch",checkMode, materialList);
router.get("/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);
router.post("/fetch/size",getSize);
router.post("/fetch/render/:size/:model/:shot",checkModes, getRender);

//Verification Code
router.post("/fetch/code/",sendCode);
router.post("/verify/code/",verifyCode);

//Cart
router.get("/fetch/cart/:userToken",fetchCart)

module.exports = router;