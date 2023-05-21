const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  addDevice,
  getAllDevices,
  getDeviceById,
  getAllRentedDevicesBySalesman,
  updateDevice,
  deleteDevice,
} = require("../controllers/deviceController");

router.route("/").post(roleAuth(["admin","salesman"]), addDevice);
router.route("/").get(getAllDevices);
router.route("/salesman").get(getAllRentedDevicesBySalesman);
router.route("/:deviceId").get(getDeviceById);
router.route("/update/:deviceId").put(roleAuth(["admin","salesman"]), updateDevice);
router.route("/:deviceId").delete(roleAuth(["admin","salesman"]), deleteDevice);

module.exports = router;
