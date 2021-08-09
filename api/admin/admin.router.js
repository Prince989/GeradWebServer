const router = require("express").Router();
const {
    fetchDirs,
    AddFabric,
    AddLining,
    FabricRenderPreview,
    FabricRender,
    fabricList,
    DeleteFabric,
    fetchAdminMenu,
    LiningRenderPreview
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/:object/dirs",fetchDirs);
router.get("/fetch/admin/menu",fetchAdminMenu);
router.get("/fabric/list/fetch", fabricList);
router.post("/fabric/upload",AddFabric);
router.post("/lining/upload",AddLining);
router.post("/fabric/set/tile",FabricRenderPreview);
router.post("/lining/set/color",LiningRenderPreview);
router.post("/fabric/render",FabricRender);

router.delete("/fabric/delete/:id",DeleteFabric);

module.exports = router;
