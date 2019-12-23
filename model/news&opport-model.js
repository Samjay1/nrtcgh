
const mongo = require('mongoose');


var NewsOppSchema = mongo.Schema({
    title: String,
    message: String,
    blogimage:String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("newsoppmodel", NewsOppSchema);