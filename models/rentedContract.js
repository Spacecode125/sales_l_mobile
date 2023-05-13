const Mongoose = require("mongoose");
const RentedContractSchema = new Mongoose.Schema({
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    
});

const RentedContract = Mongoose.model("RentedContract", RentedContractSchema);
module.exports = RentedContract;