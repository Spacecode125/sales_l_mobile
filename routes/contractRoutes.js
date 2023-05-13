const router = require("express").Router();
const {
    createContract,
    getContracts,
    getContractByReference,
    deleteContract,
} = require("../controllers/contractController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", roleAuth(["admin","salesman"]), createContract);
router.get("/", roleAuth(["admin"]), getContracts);
router.get("/:reference", roleAuth(["admin"]), getContractByReference);
router.delete("/:reference", roleAuth(["admin"]), deleteContract);



module.exports = router;