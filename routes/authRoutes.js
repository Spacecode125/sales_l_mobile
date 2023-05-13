const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/", roleAuth(["admin"]), getUsers);
router.get("/:userId", roleAuth(["admin"]), getUserById);
router.put("/update", roleAuth(["admin","user","salesman"]), updateUser);
router.delete("/:userId", roleAuth(["admin"]), deleteUser);


module.exports = router;