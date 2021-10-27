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
    setSize,
    getProfile,
    setProfile,
    fetchCart
} = require("./user.controller");

const{
    checkMode,
    checkModes,
   
} = require("../../middlewares/check.mode");
const { checkToken } = require("../../middlewares/token_validation");

router.get("/fetch/menu",fetchMenu);
router.get("/default/fetch/all", getDefault);
router.get("/:mode/list/fetch",checkMode, materialList);
router.get("/:fabricId/:liningId/:buttonId/:size/:model/:shot", setRender);
router.get("/fetch/profile",checkToken,getProfile);
router.post("/fetch/size",getSize);
router.post("/fetch/render/:size/:model/:shot",checkModes, getRender);
router.post("/set/size",setSize);
router.post("/set/profile",setProfile);
router.post("/check/user",checkToken,(req,res) => {return res.json({"Success" : "1"})});

//Verification Code
router.post("/fetch/code/",sendCode);
router.post("/verify/code/",verifyCode);

//Cart
router.get("/fetch/cart/",checkToken,fetchCart)

module.exports = router;