const express = require('express');
const path = require('path')
const router = express.Router();
const cryptr = require('../config/cryptr');
const bcrypt = require('bcryptjs');
const db = require("../config/db") ;
const app = express();
const verificationEmail = require("../config/emailVerification");

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static('public'));

router.post('/signUp',(req,res) => {
   
    const Info = `${req.body.name}|${req.body.email}|${req.body.phone}|${req.body.password}|${req.body.type}|${req.body.website}|${req.body.location}`
    const hashedInfo = cryptr.encrypt(Info);
    db.query('SELECT email FROM account WHERE email = ?',[req.body.email],async(error,results) => {
        if(error){
            throw error;
        }
        if(results.length  > 0 ){
            const invalidmessage = 'الايميل مستخدم من قبل الرجاء ادخال ايميل اخر'
            const validmessage = false
            return res.render('signUp',{ validmessage,invalidmessage });
        }else{
         verificationEmail.sendVerEmail(req.body.email,hashedInfo);
         const validmessage = "تم ارسال رابط الى بريدك الالكتروني، يرجى فتح الرابط من بريدك الإلكتروني لتتمكن من تسجيل الدخول"
         const invalidmessage = false;
         res.render('signUp',{validmessage,invalidmessage})
        } 
    })  
});
module.exports = router;