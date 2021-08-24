const router = require("express").Router();
const {
    fetchDirs,
    AddMaterial,
    DeleteMaterial,
    materialList,
    Render,
    Preview,
    fetchAdminMenu,
    fetchTiles
} = require("./admin.controller");
const {
    checkToken
} = require("../../middlewares/token_validation");
const{
    checkMode
} = require("../../middlewares/check.mode");

router.get("/fetch/:mode/dirs",checkMode,fetchDirs);
router.get("/:value/tiles",fetchTiles);
router.get("/fetch/admin/menu",fetchAdminMenu);
router.get("/:mode/list/fetch",checkMode, materialList);
router.post("/:mode/upload",checkMode,AddMaterial);
router.post("/:mode/render",checkMode,Render);
router.post("/:mode/preview",checkMode,Preview);

router.delete("/:mode/delete/:id",checkMode,DeleteMaterial);

module.exports = router;