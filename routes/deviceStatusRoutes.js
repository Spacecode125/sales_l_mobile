const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  addDeviceStatus,
  getAllDevicesStatusBySalesman,
  getDeviceStatusById,
  updateDeviceStatus,
  deleteDeviceStatus,
} = require("../controllers/deviceStatusController");

router.route("/:RentedContractId").post(roleAuth(["admin","salesman"]), addDeviceStatus);
router.route("/").get(roleAuth(["admin","salesman"]), getAllDevicesStatusBySalesman);
router.route("/:deviceStatusId").get(getDeviceStatusById);
router.route("/update/:deviceStatusId").put(roleAuth(["admin","salesman"]), updateDeviceStatus);
router.route("/:deviceStatusId").delete(roleAuth(["admin","salesman"]), deleteDeviceStatus);

module.exports = router;
