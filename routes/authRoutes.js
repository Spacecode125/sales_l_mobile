const router = require("express").Router();
const {
  register,
  login,
  getUsers,
  getUserById,
  findEmail,
  updateUser,
  deleteUser,
  resetPassword,
} = require("../controllers/authController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/", roleAuth(["admin"]), getUsers);
router.get("/findEmail", findEmail);
router.route("/resetPass").post(resetPassword);
router.get("/:userId", roleAuth(["admin","user","salesman"]), getUserById);
router.put("/update", roleAuth(["admin","user","salesman"]), updateUser);
router.put("/updatePass", roleAuth(["admin","user","salesman"]), updatePassword);
router.delete("/:userId", roleAuth(["admin"]), deleteUser);


module.exports = router;