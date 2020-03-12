const path = require('path');
const express = require('express');
const bodyparser = require('body-parser');
const mongo = require('mongoose');
const app = express(); 
const staticPages = require("./Controllers/staticPagesRoutes");
const contactmodel = require("./model/contact-model");
const subscribemodel = require("./model/subscribe-model");
const trainingmodel = require('./model/trainingDate-model');
const newsOppmodel = require('./model/news&opport-model');
const fundedResearchmodel = require('./model/fundedResearch-model');
const studentResearchmodel = require('./model/studenResearch-model');
const registermodel = require('./model/register-model');
var multer  = require('multer') ;
var bcrypt  = require('bcrypt');
const image2base64 = require('image-to-base64');

var urlparser = bodyparser.urlencoded({extended: false});
var json = bodyparser.json();


app.use(express.static('public'));
app.set("view engine", 'ejs'); 

var path2 = "mongodb://localhost:27017/nrtc_test";
var path1= 'mongodb://nrtcdb1:nrtcdb1@ds031157.mlab.com:31157/nrtcdb';

mongo.connect(path1);


app.get('/index', async function(req, res){

    await newsOppmodel.find({}, function(err,blogdata){
         if(err) throw err;
         console.log(err)
 
         res.render( "index.ejs", {blogdata});
     });
 
    
 });
 app.get('/', async function(req, res){

    await newsOppmodel.find({}, function(err,blogdata){
         if(err) throw err;
         console.log(err)
 
         res.render( "index.ejs", {blogdata});
     });
 
    
 });

app.get('/about', (req, res)=>{
    res.render("about.ejs",);
});

app.get('/gallery', (req, res)=>{
    res.render("gallery.ejs");
});

app.get('/news' , async (req, res)=>{
    await newsOppmodel.find({}, function(err,blogdata){
        if(err) throw err;
        console.log(err)

        res.render( "news.ejs", {blogdata});
    });
 
});



app.get('/contact', (req, res)=>{
    res.render("contact.ejs");
});

app.post('/contact',json,urlparser, (req, res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var message = req.body.message;

    res.status(200);

    contactmodel.create({name:name, email:email, phone:phone, message:message}, function(err,data){
        if(err) throw err;
        console.log(err,data)
    })

    res.redirect("/");



});


//register and login downwards
app.get('/register',(req,res) =>{

    res.render("register.ejs")
})

app.post('/register', json,  (req,res) =>{
    var fname = req.body.fname;
    var sname = req.body.sname;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;

    // await bcrypt.hash("req.body.password", 10, (err, hash) =>{
        if (password != cpassword){
            console.log('error', "Password not the same!");
            // res.status(201).json({error:err});
        }
        else{

            console.log('success', hash);
            registermodel.create({ 
                firstName:fname,
                surName: sname, 
                email:email,
                password: password }
            ,function (err, data){
                if(err) throw err;
                console.log(err,data)
            });
        }
    // })
    
    res.render("register.ejs")
})




//login stuff here
app.get('/login',(req,res) =>{

    res.render("login.ejs")
})


app.post('/login',json,urlparser, (req,res) =>{

    //res.render('update-nrtc.ejs');
    var email = req.body.email;
    var password = req.body.password;

     registermodel.find({email:email},{password:password}, (err, data)=>{
        if(err) throw err;
        console.log(data)
         if(data.length!=0){
             res.render('update-nrtc.ejs');
         }
         else if(email == "awinsamp@yahoo.com" && password =="TfcvG-nrtc02!"){
            res.render('update-nrtc.ejs');
         }
         else {res.redirect("index")}

    }); 
})



//DASHBOARD
app.get("/dashboard", (req, res)=>{

    res.render("update-nrtc.ejs")
});

//LOAD BLOG IN ADMIN PAGE
app.get("/blogs", async (req, res)=>{

    await newsOppmodel.find({}, function(err,blogdata){
        if(err) throw err;
        console.log(err)

        res.render( "blogs.ejs", {blogdata});
    });
});

//DELETE BLOG
app.get("/del-news/:id", (req, res)=>{
    var id = req.params.id;
    
    var success = "News/Opportunity Blog deleted successfully...";

     newsOppmodel.findById(id).remove().exec();

    res.render("success.ejs",{success});
});


//LOAD BLOG IN ADMIN PAGE
app.get("/sfresearch", async (req, res)=>{

    var sdata;
    var fdata;
    await studentResearchmodel.find({}, function(err,data){
        if(err) throw err;
        sdata = data; 
         fundedResearchmodel.find({}, function(err,data){
            if(err) throw err;
            fdata = data;
            res.render( "sfresearch.ejs", {fdata, sdata});
        });
    });
    // await fundedResearchmodel.find({}, function(err,data){
    //     if(err) throw err;
    //     fdata = data;
    //     // console.log(err)
    // });

    // res.render( "sfresearch.ejs", {fdata, sdata});
});

//DELETE STUDENT RESEARCH
app.get("/del-sresearch/:id", (req, res)=>{
    var id = req.params.id;
    
    var success = "One Student Research deleted successfully...";

    studentResearchmodel.findById(id).remove().exec();

    res.render("success.ejs",{success});
});

//DELETE FUNDED RESEARCH
app.get("/del-fresearch/:id", (req, res)=>{
    var id = req.params.id;
    
    var success = "One Funded Research deleted successfully...";

    fundedResearchmodel.findById(id).remove().exec();

    res.render("success.ejs",{success});
});

//Subscribers routes

app.get("/subscribers", (req, res)=>{

    subscribemodel.find({}, function (err, data){
        if(err) throw err;
        console.log(err,data)
        res.render("subscribers.ejs", {data})
    });
});

app.post('/subscribe',json,urlparser, (req, res)=>{
    var email = req.body.some;
    console.log(email)

    subscribemodel.create({email:email}, function (err, data){
        if(err) throw err;
        console.log(err,data)
    });
    res.redirect("index");

});


//client_contacts routes

app.get("/client_contacts", (req, res)=>{
    contactmodel.find({}, function (err, data){
        if(err) throw err;
        console.log(err)
        res.render("client_contacts.ejs", {data});
    });
});



//////////SENDING DATA FROM THE ADMIM-PAGE OR update-nrtc.ejs TO THE DATABASE

//UPDATE TRAINING DATE
app.post('/trainingDate',json,urlparser, (req,res) =>{
    var trainD = req.body.dateText;
    console.log(trainD);

    var success = "Training date has been updated...";

    trainingmodel.update({trainingDate:trainD}, function (err, data){
        if(err) throw err;
        console.log(err,data)
    });
    res.render("success.ejs",{success});
    
});
app.get('/training', async (req, res)=>{

    await trainingmodel.findOne({}, function(err,data){
        if(err) throw err;
        console.log(err,data)
        res.render( "training.ejs", {data});
    }); 
});

// MULTER IMAGES UPLOADS HERE
var storage  = multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb){
      var filename = Date.now();
      switch (file.mimetype) {
        case 'image/png':
        filename = filename + ".png";
        break;
        case 'image/jpeg':
        filename = filename + ".jpeg";
        break;
        case 'image/jpg':
        filename = filename + ".jpg";
        break;
        default:
        break;
      }
      cb(null, filename);
    }
  });
  var upload = multer({ storage: storage});
  

//UPDATE NEWS AND OPPORTUNITY PAGE
app.post('/updateBlog',json,urlparser, (req,res) =>{
    var btitle = req.body.blogtitle;
    var bmessage = req.body.blogmessage;
    var imagepath = req.file.path; 

//////////////////////////////////
    
image2base64(imagepath) // you can also to use url
    .then(
        (response) => {
            var new_response = "data:image/png;base64," + response;  
            var success = "News and Opportunity Page added..."
            newsOppmodel.create({title:btitle, message:bmessage, blogimage:new_response}, function (err, data){
                if(err) throw err;
                // console.log(new_response)
            });
            res.render("success.ejs",{success});

        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )
    //////////////////////


   
    
});

app.get('/news/:id', async (req,res)=>{
    var id = req.params.id;
    console.log('tag', id);

    await newsOppmodel.findById(id, function(err,data){
        if(err) throw err;
        console.log(err)
        res.render('news-one.ejs',{data});
    });
    
})



//UPDATE STUDENT RESEARCH PAGE
app.get("/studentResearch", async (req,res)=>{

    await studentResearchmodel.find({}, function(err,data){
        if(err) throw err;
        console.log(err)

        res.render( "studentResearch.ejs", {data});
    });
 
})
app.post('/StudentResearch',json,urlparser, (req,res) =>{
    var title = req.body.title;
    var message = req.body.message;
    var studentName = req.body.studentName;
    var degree = req.body.degree;

    var success = "Student Research Page added..."

    studentResearchmodel.create(
        {title:title, 
        studentName: studentName,
        degreeAndInstitution: degree,
        message:message
    }, function (err, data){
        if(err) throw err;
        console.log(err)
    });
    res.render("success.ejs",{success});
    
});
app.get('/StudentResearch/:id', async (req,res)=>{
    var id = req.params.id;
    console.log('tag', id);

    await studentResearchmodel.findById(id, function(err,data){
        if(err) throw err;
        console.log(err)
        res.render('student-one.ejs',{data});
    });
    
})


//UPDATE FUNDED RESEARCH PAGE
app.get("/fundedResearch", async (req,res)=>{

    await fundedResearchmodel.find({}, function(err,data){
        if(err) throw err;
        console.log(err)

        res.render( "fundedResearch.ejs", {data});
    });
 
})
app.post('/fundedResearch', json,urlparser, (req,res) =>{
    var title = req.body.fundedTitle;
    var message = req.body.message;
    var researcher = req.body.researcher; 
    var imagepath = req.file.path; 

//////////////////////////////////
    
image2base64(imagepath) // you can also to use url
    .then(
        (response) => {
            var new_response = "data:image/png;base64," + response;  
            var success = "Funded Research Page added..."
            fundedResearchmodel.create(
                {title:title, 
                 researcherName: researcher, 
                 message:message,
                 imagepath:new_response
            }, function (err, data){
                if(err) throw err;
                console.log(err)
            }); 
            res.render("success.ejs",{success});

        }
    )
    .catch(
        (error) => {
            console.log(error); //Exepection error....
        }
    )
    //////////////////////

    
});

app.get('/fundedResearch/:id', async (req,res)=>{
    var id = req.params.id;
    console.log('tag', id);

    await fundedResearchmodel.findById(id, function(err,data){
        if(err) throw err;
        console.log(err)
        res.render('funded-one.ejs',{data});
    });
    
})




app.listen(process.env.PORT||1000, console.log("Server running on localhost:1000"));