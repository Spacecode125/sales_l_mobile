const router = require("express").Router();
const {
  createRentedContract,
  getRentedContracts,
  getRentedContractById,
  getAllRentedContractsBySalesman,
  deleteRentedContract,
} = require("../controllers/rentedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/:deviceId", roleAuth(["admin", "salesman", "user"]), createRentedContract);
router.get("/", getRentedContracts);
router.get("/:rentedContractId", getRentedContractById);
router.get("/salesman", roleAuth(["admin", "salesman"]), getAllRentedContractsBySalesman);
router.delete("/:rentedContractId", roleAuth(["admin","salesman"]), deleteRentedContract);

module.exports = router;
