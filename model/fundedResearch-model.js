
const mongo = require('mongoose');


var FundedResearchSchema = mongo.Schema({
    title: String, 
    researcherName: String,
    message: String,
    imagepath:String,
    createdAt:{
        type: Date,
        default: new Date()

    }
});

module.exports =  mongo.model("fundedresearchmodel", FundedResearchSchema);