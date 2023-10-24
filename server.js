const express = require("express");
const mysql = require("mysql")
const cors = require("cors")
const nodemailer = require("nodemailer");
const { differenceInCalendarMonths } = require("date-fns");
const app = express();
app.use(cors());
app.use(express.json())




const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: "Stocks"
})




app.post("/druginput", (req, res) => {
    const sql = "INSERT INTO Drugs (`DrugName`,`DrugCategory`, `Quantity` , `DateAdded`, `ExpiryDate`) VALUES (?)";
    const values = [
        req.body.drugname,
        req.body.drugcategory,
        req.body.quantity,
        req.body.date,
        req.body.expirydate
        
    ];
    db.query(sql, [values], (err, data) => {
       if(err){
          return (res.json("Database Error"))
       }
        return (res.json(data))

       
    } )
})


app.put("/update/:id", (req, res) => {
    const sql = "update Drugs set `DrugName` = ?, `DrugCategory` = ?, `Quantity` = ?,  `DateAdded` = ? , `ExpiryDate` = ? where id = ?";
    const values = [
        req.body.drugname,
        req.body.drugcategory,
        req.body.quantity,
        req.body.date,
        req.body.expirydate
        
    ];

    const id = req.params.id
    db.query(sql, [...values, id], (err, data) => {
       if(err){
          return (res.json("Database Error"))
       }
        return (res.json(data))

       
    } )
})


app.delete("/showdrugs/:id", (req, res) => {
    const sql = "DELETE FROM Drugs where id = ?";
    

    const id = req.params.id
    db.query(sql, [id], (err, data) => {
       if(err){
          return (res.json("Database Error"))
       }
        return (res.json(data))

       
    } )
})

app.post("/", (req, res) => {
    const sql2 = "SELECT * from Login WHERE `Email`=? AND `Passwd`=?";
    db.query(sql2, [req.body.email, req.body.pass] ,(err, data) => {
        if (err) {

            return res.json("Error")
        }
        if(data.length > 0){
            return res.json("success")
        }
        else{
            return res.json("fail")
        }
        ;
       })

       
})



app.get("/showdrugs", (req, res) => {

   const sql = "SELECT * from Drugs ORDER BY ExpiryDate ASC";
   const sql2 = "SELECT * from Drugs";
   const date = new Date();

   db.query (sql, (err, data) => {
    if (err) {
        return res.json("Error")
    }
    return res.json(data)
 
   })

   db.query (sql2, (err, dt) => {
    if (err) {
        return res.json("Error")
    }
    var string=JSON.stringify(dt);
        var json =  JSON.parse(string);
        console.log('>> json: ', json);
        var myvar = json.filter(i => {
            let myexpiry = i.ExpiryDate;
            const truncatedDate = new Date(myexpiry).toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'})
  
            const startDate = new Date();
 
            const endDate = new Date(truncatedDate);
            return (differenceInCalendarMonths(endDate,startDate) == 1 || differenceInCalendarMonths(endDate,startDate) <=3)
        
        })
        
    
        req.list = json;

        function  sendmail(){
        
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
                 subject: "Drugs Expiring Soon",
                 html: `<h3>Drug Store<h3/>
                 <ul><h2> ${
                   myvar.map((value) => {
                    const myexpiry = value.ExpiryDate;
                    const truncatedDate = new Date(myexpiry).toLocaleDateString('en-CA', {year: 'numeric', month: '2-digit', day: '2-digit'})
                    const endDate = new Date(truncatedDate);
                    console.log(value.DrugName + " "  + "expires in" + " " + differenceInCalendarMonths(endDate,date) + " " + "Months" );
                    return (value.DrugName + " "  + "expires in" + " " + differenceInCalendarMonths(endDate,date) + " " + "Months")
                   })
                   }  </h2></ul>`
                }
                transporter.sendMail(mail_option, function (error, info) {
                     if(error){
                         return reject({message: "error occured"})
                     }
                     return resolve({message: "message sent successfully"})
                })
             })
        
         
         
        }

      
        if(myvar.length > 0){
            sendmail();
        }
        else{
            console.log("No response")
        }
           
        


    })

   
   
   
    
})

app.listen(8081, () => {
    console.log("listening...");
})

