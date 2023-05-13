const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { userAuth } = require("../middleware/auth");

router.post("/register", roleAuth(["user", "salesman"]), register);
router.post("/login", roleAuth(["user", "salesman", "admin"]), login);
router.get("/", roleAuth("admin"), getUsers);
router.get("/:userId", roleAuth("admin"), getUserById);
router.put("/:userId", roleAuth("admin"), updateUser);
router.delete("/:userId", roleAuth("admin"), deleteUser);
