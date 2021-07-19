const router = require("express").Router();
const {
    fetchDirs,
    AddFabric
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/dirs",checkToken,fetchDirs);
router.post("/upload",checkToken,AddFabric);

module.exports = router;
