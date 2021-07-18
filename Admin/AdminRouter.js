const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");
const {
    login,
    getDirs,
    upload,
    setTile,
    getRenders
} = require("./admin.controller");

router.get("/", checkToken, getUsers);
router.post("/", checkToken, createUser);
router.get("/:id", checkToken, getUserByUserId);
router.post("/login", login);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);

module.exports = router;