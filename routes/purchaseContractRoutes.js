const router = require("express").Router();
const {
  acceptPurchaseContract,
  cancelPurchaseContract,
  createPurchaseContract,
  getAllPurchaseContractsBySalesman,
  getPurchaseContractById,
  getPurchaseContracts
} = require("../controllers/purchaseContractController");
const { roleAuth } = require("../middleware/auth");

router.post("/:deviceId", roleAuth(["admin", "salesman", "user"]), createPurchaseContract);
router.get("/", roleAuth(["admin"]),getPurchaseContracts);
router.get("/salesman", roleAuth(["admin", "salesman"]), getAllPurchaseContractsBySalesman);
router.get("/byId/:purchaseContractId", roleAuth(["admin","salesman"]),getPurchaseContractById);
router.delete("/accept/:purchaseContractId", roleAuth(["admin","salesman"]), acceptPurchaseContract);
router.delete("/cancel/:purchaseContractId", roleAuth(["admin","salesman"]), cancelPurchaseContract);

module.exports = router;
