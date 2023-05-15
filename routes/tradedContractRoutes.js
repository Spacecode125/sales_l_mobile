const router = require("express").Router();
const {
  createTradedContract,
  getTradedContracts,
  getTradedContractById,
  deleteTradedContract,
} = require("../controllers/tradedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/", roleAuth(["admin", "salesman"]), createTradedContract);
router.get("/", getTradedContracts);
router.get("/:tradedContractId", getTradedContractById);
router.delete("/:tradedContractId", roleAuth(["admin","salesman"]), deleteTradedContract);

module.exports = router;
