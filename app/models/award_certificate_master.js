const { json } = require('express');
const sql = require('./db.js');

const AwardCertficateModel = function(model){
    this.uid = model.uid,
    // this.pinfoid  = model.pinfoid,
    this.name=model.name,
    this.image=model.image,
    this.year = model.year,
    this.createdby = model.uid
    // this.createdon = model.createdon
}



AwardCertficateModel.create = ([uid,award,certificate],result)=>{

    addInfo(uid,award,certificate).then(()=>{
        result(null,{status:"success",message:"Media Inserted Successfully"});
    }).catch(()=>{
        result(null,{status:"failure",message:"Something went wrong"});
    });
   
}
AwardCertficateModel.deleteAward = ([uid,awardid],result)=>{

    deleteAward(uid,awardid).then(()=>{
        result(null,{status:"success",message:"Award Deleted Successfully",});
    }).catch(({

    }));
   
}
AwardCertficateModel.deleteCertificate = ([uid,awardid],result)=>{

    deleteCertificate(uid,awardid).then(()=>{
        result(null,{status:"success",message:"Certificate Deleted Successfully",});
    }).catch(({

    }));
   
}

function addInfo(uid,award,certificate){
    return new Promise((resolve,reject)=>{
        
        if(award.name != ""){
            sql.query("INSERT INTO award_master SET ?",award,(err,res)=>{
                if(err){
                    
                    console.log('Media Insert Failed due to '+err);
                    reject();
                    return;
                }
                console.log('Media Inserted successfully');
                
            })
        }
        if(certificate.name != ""){
            sql.query("INSERT INTO certificate_master SET ?",certificate,(err,res)=>{
                if(err){
                    
                    console.log('Media Insert Failed due to '+err);
                    reject();
                    return;
                }
                console.log('Media Inserted successfully');
                
            })
        }
        
        resolve();
       
    });
}
function deleteAward(uid,awardid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM award_master WHERE awardid = ? AND uid = ?",[awardid,uid],(err,res)=>{
                if(err){
                    
                    console.log('Award Delete Failed due to '+err);
                    return;
                }
                console.log('Award Deleted successfully');
                resolve();
            })
    });
}
function deleteCertificate(uid,awardid){
    return new Promise((resolve,reject)=>{
        sql.query("DELETE FROM certificate_master WHERE awardid = ? AND uid = ?",[awardid,uid],(err,res)=>{
                if(err){
                    
                    console.log('Certificate Delete Failed due to '+err);
                    return;
                }
                console.log('Certificate Deleted successfully');
                resolve();
            })
    });
}
// function updateInfo(model){
//     return new Promise((resolve,reject)=>{
//         sql.query("UPDATE trade_member_master SET ? WHERE uid = ?",[model,model.uid],(err,res)=>{
//                 if(err){
                    
//                     console.log('Media Insert Failed due to '+err);
//                     return;
//                 }
//                 console.log('Media Updated successfully');
//                 resolve(res.insertId);
//             })
//     });
// }



AwardCertficateModel.getInfo = (uid,result)=>{
    
    getData(uid).then((data)=>{
        result(null,{status:"success",message:"Media Fetched Successfully",data:data});
    })

    
}

function getData(uid){
    return new Promise((resolve,reject)=>{

        var data = {};
        sql.query("SELECT * FROM certificate_master WHERE uid = ?",[uid],(err,rows)=>{
            if(err){
                result(err,{status:"failure",message:err,data:{}});
                
                return;
            }
    
            data['certificate'] = rows;
           
            sql.query("SELECT * FROM award_master WHERE uid = ?",[uid],(err,rows)=>{
                if(err){
                    result(err,{status:"failure",message:err,data:{}});
                    
                    return;
                }
        
                data['award'] = rows;
                resolve(data);
        
                
        
               
                
            })
    
           
            
        })
    })
}



module.exports = AwardCertficateModel;