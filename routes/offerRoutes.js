const router = require("express").Router();
const { roleAuth } = require("../middleware/auth");
const {
  getAllOffers,
  getAllOffersBySalesman,
} = require("../controllers/offerController");

router.route("/").get(roleAuth(["admin"]),getAllOffers);
router.route("/salesman").get(roleAuth(["admin","salesman"]),getAllOffersBySalesman);

module.exports = router;
