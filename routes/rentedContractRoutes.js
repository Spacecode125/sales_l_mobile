const router = require("express").Router();
const {
  createRentedContract,
  getRentedContracts,
  getRentedContractById,
  deleteRentedContract,
} = require("../controllers/rentedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/:deviceId", roleAuth(["admin", "salesman"]), createRentedContract);
router.get("/", getRentedContracts);
router.get("/:rentedContractId", getRentedContractById);
router.delete("/:rentedContractId", roleAuth(["admin","salesman"]), deleteRentedContract);

module.exports = router;
