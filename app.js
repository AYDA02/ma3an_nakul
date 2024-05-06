const express = require('express');// استيراد المكتبة لبناء تطبيق الويب
const path = require('path');//للتعامل مع المسارات
const app = express();
const PORT = process.env.PORT ||3000 //تعيين المنفذ الي بشتغل عليه الموقع
const session = require('express-session');

app.use(express.json());//لاضافة الجلسات
app.use(session({ 
    secret: '123456catr',
    resave: false,//لمنع حفظ الجلسات التي لم تتغير
    saveUninitialized: false,//لمنع إنشاء جلسات لكل طلب وحفظها
    cookie: { maxAge: 10000000 } 
}))

const publicDirectory = path.join(__dirname,'public');//تعريف مسار المجلد العام الذي يحتوي على الملفات الثابتة لموقع الويب
app.set('views', __dirname + '/views');//يحدد مسار المجلد الذي يحتوي على ملفات العرض (مثل ملفات EJS).
// يستخدم المتغير __dirname للحصول على مسار المجلد الحالي للتطبيق،
// ثم يتم دمجه مع اسم المجلد "views".
app.set("view engine", "ejs")
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended:false }));


app.use('/',require('./routes/pages').router);
app.use('/profile',require('./routes/profile'));
app.post('/edit',(req,res)=>{res.render('EditProfilePage',{message:false});})
app.use('/auth1',require('./routes/signUp'));
app.use('/auth2',require('./routes/Login'));
app.use('/change',require('./routes/changepassword'));
app.use('/deleteacount',require('./routes/deleteAcount'));
app.use("/",require("./routes/contactUs"))
app.use('/',require('./routes/verifications'));
app.use('/meal',require('./routes/meals'))
app.use('/res',require('./routes/meals')) 
app.use('/', require("./routes/logout"))
app.use('/', require('./routes/foodBooking'))
app.use('/', require('./routes/forgetPassword'))
app.use((req, res) => {// التعامل مع الطلبات التي لم تتوافق مع أي مسار موجود
    res.status(404).render('error');
  });


app.listen(PORT, ()=>{//بدأ التشغيل على النفذ المحدد
    console.log(`Connected in ${PORT} port`);
})


