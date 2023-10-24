const express = require("express");
const nodemailer = require("nodemailer");
const app = express();

function sendmail(){
    return new Promise((resolve, reject) => {
 
       var transporter = nodemailer.createTransport({
             service: "gmail",
             auth: {
                user:"papa10058@gmail.com",
                pass: "sqdqdxaoximzgypv"
             }
       })        
       
       const mail_option = {
        from:"papa10058@gmail.com",
        to:"hendrixomar66@gmail.com",
        subject: "Hey",
        message: "this is my message"
       }
       transporter.sendMail(mail_option, function (error, info) {
            if(error){
                return reject({message:"an error occured"})
            }
            return resolve({message: "message sent successfully"})
       })
    })
}

app.get("/", (res, req) => {
    sendmail().then(response => res.send(response.message))
    .catch(error => res.status(500).send(error.message))
})

app.listen(5000, () => {
    console.log("Email listening...");
})