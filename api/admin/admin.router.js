const router = require("express").Router();
const {
    fetchDirs,
    AddFabric,
    RenderPreview
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/dirs",fetchDirs);
router.post("/fabric/upload",AddFabric);
router.post("/fabric/set/tile",RenderPreview);

module.exports = router;
