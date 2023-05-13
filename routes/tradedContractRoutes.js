const router = require("express").Router();
const {
  createTradedContract,
  getTradedContracts,
  getTradedContractById,
  deleteTradedContract,
} = require("../controllers/tradedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/", roleAuth(["admin", "salesman"]), createTradedContract);
router.get("/", roleAuth(["admin"]), getTradedContracts);
router.get("/:tradedContractId", roleAuth(["admin"]), getTradedContractById);
router.delete("/:tradedContractId", roleAuth(["admin"]), deleteTradedContract);

module.exports = router;
