
const mongo = require('mongoose');


var TrainingSchema = mongo.Schema({
    trainingDate: String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("trainingmodel", TrainingSchema);