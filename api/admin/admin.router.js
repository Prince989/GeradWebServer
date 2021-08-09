const router = require("express").Router();
const {
    fetchDirs,
    AddFabric,
    AddLining,
    FabricRenderPreview,
    FabricRender,
    LiningRender,
    fabricList,
    liningList,
    DeleteFabric,
    DeleteLining,
    fetchAdminMenu,
    LiningRenderPreview
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/:object/dirs",fetchDirs);
router.get("/fetch/admin/menu",fetchAdminMenu);
router.get("/fabric/list/fetch", fabricList);
router.get("/lining/list/fetch", liningList);
router.post("/fabric/upload",AddFabric);
router.post("/lining/upload",AddLining);
router.post("/fabric/set/tile",FabricRenderPreview);
router.post("/lining/set/color",LiningRenderPreview);
router.post("/fabric/render",FabricRender);
router.post("/lining/render",LiningRender);

router.delete("/fabric/delete/:id",DeleteFabric);
router.delete("/lining/delete/:id",DeleteLining);

module.exports = router;