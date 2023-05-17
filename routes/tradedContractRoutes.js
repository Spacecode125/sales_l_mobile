const router = require("express").Router();
const {
  createTradedContract,
  getTradedContracts,
  getTradedContractById,
  getAllTradedContractsBySalesman,
  deleteTradedContract,
} = require("../controllers/tradedContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/", roleAuth(["admin", "salesman", "user"]), createTradedContract);
router.get("/", roleAuth(["admin"]),getTradedContracts);
router.get("/byId/:tradedContractId", roleAuth(["admin","salesman"]),getTradedContractById);
router.get("/salesman", roleAuth(["admin", "salesman"]), getAllTradedContractsBySalesman);
router.delete("/:tradedContractId", roleAuth(["admin","salesman"]), deleteTradedContract);

module.exports = router;
