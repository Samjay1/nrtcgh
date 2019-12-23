
const mongo = require('mongoose');


var ContactSchema = mongo.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("contactmodel", ContactSchema);