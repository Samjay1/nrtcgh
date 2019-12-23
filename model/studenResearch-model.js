
const mongo = require('mongoose');


var StudentResearchSchema = mongo.Schema({
    studentName: String,
    title: String,
    degreeAndInstitution: String,
    message: String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("studentresearchmodel", StudentResearchSchema);