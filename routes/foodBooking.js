const express = require("express")
const router = express.Router()
const db = require('../config/db')
const {resturantPage} = require('./pages') 

router.post("/submitOrders", (req, res)=>{
    if(!req.session.userId) return res.redirect('/endSeccion')
    const chrityId = req.session.userId
    const resturantId = req.body.resturantId   
    const menuId = req.body.menuId.split("،")
    const currentTime = new Date()  
    let frequency = [] 
  //تحقق مما إذا كان المستخدم قد أجرى حجزًا حقيقيًا (اختر حجزًا واحدًا على الأقل للحجز)
        if(req.body.menuId.length){
        db.query("SELECT * FROM ma3annakul.menu where account_id =? ", [resturantId], (error, _result)=>{
            if(error){
                console.log("Error while retreiving menu ids     "+error)
                res.redirect(`/errorPage`)
            }else{
                for(let i = 0; i<_result.length; i++){
                    frequency.push(menuId.filter(x => x == _result[i].id).length) 
                }

                for(let i = 0; i < _result.length; i++){
                    db.query("select * from ma3annakul.orders where account_id =? and menu_id =?", [chrityId, _result[i].id], (error, ordersResult)=>{
                        if(error){
                            console.log("Error while retreiving from orders     "+error)
                            res.redirect('/errorPage')             
                        }else{ 
                            if(ordersResult.length == 0){
                                if(frequency[i] != 0){
                                    db.query("INSERT INTO `ma3annakul`.`orders` (`date`, `time`, `quantity`, `account_id`, `menu_id`) VALUES (?, ?, ?, ?, ?)", [currentTime.toLocaleDateString(), currentTime.toLocaleTimeString(), frequency[i], chrityId, _result[i].id], (error, result)=>{
                                        if(error){
                                            console.log("Error while retreiving from orders     "+error)
                                            res.redirect('/errorPage') 
                                        }else{
                                            db.query("UPDATE `ma3annakul`.`menu` SET quantity = ? WHERE id =?",[_result[i].quantity - frequency[i], _result[i].id], (error, result)=>{
                                                if(error){
                                                    console.log("Error while updating the quantity     "+error)
                                                    res.redirect('/errorPage') 
                                                }
                                            })
                                        }
                                    })
                                }
                            }else{
                                if(frequency[i] != 0){
                                    db.query("UPDATE `ma3annakul`.`orders` SET quantity = ? WHERE id =?",[ordersResult[0].quantity + frequency[i], ordersResult[0].id], (error, result)=>{
                                        if(error){
                                            console.log("Error while updating the quantity     "+error)
                                            res.redirect('/errorPage') 
                                        }else{
                                            db.query("UPDATE `ma3annakul`.`menu` SET quantity = ? WHERE id =?",[_result[i].quantity - frequency[i], _result[i].id], (error, result)=>{
                                                if(error){
                                                    console.log("Error while updating the quantity     "+error)
                                                    res.redirect('/errorPage') 
                                                }
                                            }) 
                                        } 
                                    })

                                }
                            }
                        }
                    })
                }
            }
        })
        
        res.redirect(`/charityHome`)
    }else{
        if(!req.session.userId) 
            return res.redirect('/endSeccion') 
        resturantPage(true, resturantId, req.session.userId, res) 
    }
     
})
    
module.exports = router
     
