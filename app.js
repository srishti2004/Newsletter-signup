const express = require("express");
const Bodyparser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { configure } = require("./configure");


const app = express();
app.use(Bodyparser.urlencoded({extended : true}));


app.use(express.static("public"));

app.get("/" ,function (req ,res){
    res.sendFile(__dirname +"/signup.html");
})
console.log(configure.apiKey)

mailchimp.setConfig({
    apiKey: configure.apiKey,
    server: configure.server,
  });



app.post("/" ,function (req , res) {

const firstName = req.body.firstname;
const lastName = req.body.lastname;
const Email =  req.body.email;
const listId = configure.listId;
console.log(firstName ,lastName ,Email);
const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: Email
  }


  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields :{
        FNAME : subscribingUser.firstName,
        LNAME : subscribingUser.lastName
       
    }
    });
    console.log(response);
    res.sendFile(__dirname + "/success.html")

} 

run().catch(e => res.sendFile(__dirname + "/failure.html")); 
});

app.post("/failure" , function (req ,res) {
  res.redirect("/");
})


app.listen(3000 ,function () {
console.log("server started at 3000 port");
})












