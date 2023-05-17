const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  addDeviceStatus,
  getAllDevicesStausBySalesman,
  getDeviceStatusById,
  updateDeviceStatus,
  deleteDeviceStatus,
} = require("../controllers/deviceStatusController");

router.route("/").post(roleAuth(["admin","salesman"]), addDeviceStatus);
router.route("/").get(roleAuth(["admin","salesman"]), getAllDevicesStausBySalesman);
router.route("/:deviceId").get(getDeviceStatusById);
router.route("/update/:deviceId").post(roleAuth(["admin","salesman"]), updateDeviceStatus);
router.route("/:deviceId").delete(roleAuth(["admin","salesman"]), deleteDeviceStatus);

module.exports = router;
