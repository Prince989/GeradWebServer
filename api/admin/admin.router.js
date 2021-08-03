const router = require("express").Router();
const {
    fetchDirs,
    AddFabric,
    RenderPreview,
    FabricRender,
    fabricList,
    DeleteFabric
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/dirs",fetchDirs);
router.get("/fabric/list/fetch", fabricList);
router.post("/fabric/upload",AddFabric);
router.post("/fabric/set/tile",RenderPreview);
router.post("/fabric/render",FabricRender);
router.delete("/fabric/delete/:id",DeleteFabric);

module.exports = router;
