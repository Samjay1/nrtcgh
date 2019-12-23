
const mongo = require('mongoose');


var registerSchema = mongo.Schema({
    firstName: String,
    surName: String,
    email: String,
    password:String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("registermodel", registerSchema);