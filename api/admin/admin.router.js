const router = require("express").Router();
const {
    fetchDirs,
    AddFabric,
    AddLining,
    AddButton,
 /*   FabricRenderPreview,
    ButtonRenderPreview,
    LiningRenderPreview,
    FabricRender,
    LiningRender,
    ButtonRender,*/
    Render,
    Preview,
    fabricList,
    liningList,
    buttonList,
    DeleteFabric,
    DeleteLining,
    DeleteButton,
    fetchAdminMenu,
    testv
} = require("./admin.controller");
const {
    checkToken
} = require("../../auth/token_validation");

router.get("/fetch/:object/dirs",fetchDirs);
router.get("/fetch/admin/menu",fetchAdminMenu);
router.get("/fabric/list/fetch", fabricList);
router.get("/lining/list/fetch", liningList);
router.get("/button/list/fetch", buttonList);
router.post("/fabric/upload",AddFabric);
router.post("/lining/upload",AddLining);
router.post("/button/upload",AddButton);
router.post("/:mode/render",Render);
router.post("/:mode/preview",Preview);
/*router.post("/fabric/set/tile",FabricRenderPreview);
router.post("/lining/set/color",LiningRenderPreview);
router.post("/button/set/color",ButtonRenderPreview);
router.post("/fabric/render",FabricRender);
router.post("/lining/render",LiningRender);
router.post("/button/render",ButtonRender);*/
router.get("/test/test",testv);

router.delete("/fabric/delete/:id",DeleteFabric);
router.delete("/lining/delete/:id",DeleteLining);
router.delete("/button/delete/:id",DeleteButton);

module.exports = router;