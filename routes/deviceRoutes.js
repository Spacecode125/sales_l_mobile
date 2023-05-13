const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  addDevice,
  getAllDevices,
  getDeviceById,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");

router.route("/").post(roleAuth, addDevice);
router.route("/").get(getAllDevices);
router.route("/:deviceId").get(getDeviceById);
router.route("/update/:deviceId").post(roleAuth, updateDevice);
router.route("/").delete(roleAuth, deleteDevice);

module.exports = router;
