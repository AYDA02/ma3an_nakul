const nodemailer = require('nodemailer')
const {v4: uuidv4} = require("uuid")
const bcrypt = require("bcrypt")
const db = require('./db')
const dotenv = require('dotenv').config()          

function sendVerEmail(email){
    currentURL = "http://localhost:3000/"
    const uniqueString = uuidv4();
    //توليد سلسلة فريدة من نوع uuidv4 
    //للاستخدام كمعرف فريد لطلب إعادة تعيين كلمة المرور


//يتم استخدام مكتبة Nodemailer لإنشاء مرسل(خادم) بريد إلكتروني 
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,//تشفير الاتصال 
        auth:{
            user: process.env.email,     
            pass: process.env.emailPassword, 
        }
    })  
    transporter.verify((error, success) =>{
        if(error){
            console.log("Failed to send Email" + error);
        }else{
            console.log("Email sent successfully")
        }
    })

//    //تهيئة خيارات البريد الإلكتروني
    let mailOption = {
        from: 'Admin',       
        to: email, 
        subject: 'Reset Password Request', 
        html: `<p>Please click below to be able to reset your password, once you open this link it wont be valid anymore. </p>
         <a href = ${currentURL + "resetRequest/"+ email + "/" + uniqueString}> Click here </a>`
         //النص الذي يحتوي على الرابط لإعادة تعيين كلمة المرور
    };
    //تشفير السلسلة الفريدة باستخدام bcrypt
    // وحفظها في قاعدة البيانات بجدولaccount
    hasheduniqueString = bcrypt.hash(uniqueString, 10)
    .then((hasheduniqueString) => {                 
        // seet values in     
        db.query("UPDATE account SET passwordUUID = ? WHERE email = ?", [hasheduniqueString, email], (err)=>{
            if(err){
                console.log("Error while inserting the uniqueString for password to the DB");
                res.render("newPassword", {message: "Please request another verification email"})
            }else{//step 3 
                transporter.sendMail(mailOption, function(err, data){
                    if(err){
                        console.log("Error While sending the verefication email! " + err)
                    }else{
                        console.log("Done !!")
                    }
                })//senMail
            }//else 
        })
    })
    .catch((e)=>{
        console.log("Error while hasihng the unique string  ", e)
        res.render("newPassword", {message: "Please request another verification email"})
    })
}

module.exports = {sendVerEmail}