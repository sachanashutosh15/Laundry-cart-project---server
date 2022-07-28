const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    order_id:{type: String},
    timestamp:{type:String},
    store_loaction: {type: String},
    city:{type:String},
    store_phone:{type: Number},
    total_item:{type: Number},
    price:{type: Number},
    status:{type: String}

}) 

const Orders = mongoose.model("orders",OrderSchema);
module.exports = Orders;