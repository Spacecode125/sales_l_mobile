const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  getAllOffers,
} = require("../controllers/deviceController");

router.route("/").get(getAllOffers);

module.exports = router;
