const router = require("express").Router();
const {
    createContract,
    getContracts,
    getContractByReference,
    getAllContractsBySalesman,
    deleteContract,
} = require("../controllers/contractController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", roleAuth(["admin","salesman"]), createContract);
router.get("/", roleAuth(["admin"]), getContracts);
router.get("/salesman", roleAuth(["admin","salesman"]), getAllContractsBySalesman);
router.get("/reference/:reference", roleAuth(["admin","salesman"]), getContractByReference);
router.delete("/:reference", roleAuth(["admin"]), deleteContract);



module.exports = router;