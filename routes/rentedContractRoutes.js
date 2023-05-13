const router = require("express").Router();
const {
  createRentedContract,
  getRentedContracts,
  getRentedContractById,
  deleteRentedContract,
} = require("../controllers/rentedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/", roleAuth(["admin", "salesman"]), createRentedContract);
router.get("/", roleAuth(["admin"]), getRentedContracts);
router.get("/:rentedContractId", roleAuth(["admin"]), getRentedContractById);
router.delete("/:rentedContractId", roleAuth(["admin"]), deleteRentedContract);

module.exports = router;
