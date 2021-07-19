const router = require("express").Router();
const {
    fetchDirs,
    AddFabric
} = require("./admin.controller");

router.get("/fetch/dirs",fetchDirs);
router.post("/upload",AddFabric);

module.exports = router;
