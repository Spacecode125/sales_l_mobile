const router = require("express").Router();
const {
    createContact,
    getContacts,
} = require("../controllers/contactController");
const  {roleAuth}  = require("../middleware/auth");

router.post("/", createContact);
router.get("/", roleAuth(["admin"]), getContacts);

module.exports = router;