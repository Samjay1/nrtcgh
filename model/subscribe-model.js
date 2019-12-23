
const mongo = require('mongoose');


var SubscribeSchema = mongo.Schema({
    email: String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("subscribemodel", SubscribeSchema);