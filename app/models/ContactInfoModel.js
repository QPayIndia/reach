const { json } = require('express');
const sql = require('./db.js');

const ContactInfo = function(model){
    this.uid = model.uid,
    this.contactid = model.contactid,
    this.phone = model.phone,
    this.whatsapp = model.whatsapp,
    this.landline = model.landline,
    this.tollfree = model.tollfree,
    this.email = model.email,
    this.addemail = model.addemail,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}


const OwnerInfo = function(model){
    this.uid = model.uid,
    this.ownerid = model.ownerid,
    this.isprimary = model.isprimary,
    this.nameprefix = model.nameprefix,
    this.name = model.name,
    this.designation = model.designation,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}

const PhoneInfo = function(model){
    this.uid = model.uid,
    this.phoneid = model.phoneid,
    this.phone = model.phone,
    this.isprimary = model.isprimary,
    this.search = model.search,
    this.notification = model.notification,
    this.createdon = model.createdon,
    this.createdby = model.createdby
}

ContactInfo.create = (model,owners,numbers,result)=>{
    // sql.query("INSERT INTO contact_info SET ?",model,(err,res)=>{
    //     if(err){
    //         result(err,{status:"success",message:err,data:{}});
    //         console.log('Contact Info Failed due to '+err);
    //         return;
    //     }
    //     console.log('Contact Info Inserted successfully');
    //     result(null,{status:"success",message:"News Inserted Successfully",data:{id:res.insertId}});
    // })

    // var parsedOwner = owners;
    // parsedOwner.forEach(item => {
        
    //     const owner = new OwnerInfo(
    //         {
    //             uid:model.uid,
    //             isprimary:item['isprimary'],
    //             nameprefix:item['name_prefix'],
    //             name:item['name'],
    //             designation:item['designation'],
    //             createdby:model.uid
    //         }
    //     )

       

    //     sql.query("INSERT INTO owner_master SET ?",owner,(err,res)=>{
    //         if(err){
    //             result(err,{status:"success",message:err,data:{}});
    //             console.log('Owner Info Failed due to '+err);
    //             return;
    //         }
    //         console.log('Owner Info Inserted successfully');
    //         // result(null,{status:"success",message:"News Inserted Successfully",data:{id:res.insertId}});
    //     })
    // });

    let contact = false;
    let owner = false;
    let number = false;
    var insertId = 0;

    addContactInfo(model).then((id)=>{
        contact = true;
    }).catch(({

    }));
    // addOwners(owners,model.uid).then(()=>{
    //     owner = true
    // }).catch(({

    // }));
    
    // addNumbers(numbers,model.uid).then(()=>{
    //     number = true
    // }).catch(({

    // }));
}

function addContactInfo(model){
    return new Promise((resolve,reject)=>{
        sql.query("INSERT INTO contact_info SET ?",model,(err,res)=>{
                if(err){
                    result(err,{status:"success",message:err,data:{}});
                    console.log('Contact Info Failed due to '+err);
                    return;
                }
                console.log('Contact Info Inserted successfully');
                resolve(res.insertId);
            })
    });
}

function addOwners(owners,userid){
    return new Promise((resolve,reject)=>{
        owners.forEach(item => {

            const owner = new OwnerInfo(
                        {
                            uid:userid,
                            isprimary:item['isprimary'],
                            nameprefix:item['name_prefix'],
                            name:item['name'],
                            designation:item['designation'],
                            createdby:userid
                        }
                    )
            
    
                sql.query("INSERT INTO owner_master SET ?",owner,(err,res)=>{
                if(err){
                    reject();
                    return;
                }
                console.log('Owner Info Inserted successfully');
                resolve();
            })
        });
    });
}

function addNumbers(numbers,userid){
    return new Promise((resolve,reject)=>{
        numbers.forEach(item => {

            const number = new PhoneInfo(
                        {
                            uid:userid,
                            isprimary:item['isprimary'],
                            phone:item['phone'],
                            search:item['search'],
                            notification:item['notification'],
                            createdby:userid
                        }
                    )
            
    
                sql.query("INSERT INTO phone_master SET ?",number,(err,res)=>{
                if(err){
                    reject();
                    return;
                }
                console.log('Phone Info Inserted successfully');
                resolve();
            })
        });
    });
}

ContactInfo.getData = (uid,result)=>{
    var psData = {};
    sql.query("SELECT * FROM contact_info as A,owner_master as B WHERE A.uid = B.uid AND B.isprimary = 1 and A.uid = ? LIMIT 1",[uid],(err,data)=>{
        if(err){
            result(err,{status:"failure",message:err,data:{}});
            
            return;
        }
       
        psData['binfo'] = data;

        getNumbers(uid).then((numbers)=>{
           
            psData['numbers'] = numbers;
            getOwners(uid).then((owners)=>{
                psData['owners'] = owners;
                result(null,{status:"success",message:"News Fetched Successfully",data:psData});

            })
        
        });

       
        
    })

    
}


function getNumbers(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM phone_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                
                return;
            }
    
            resolve(data)
        })
    
        
    
    });
}
function getOwners(uid){
    return new Promise((resolve,reject)=>{
        sql.query("SELECT * FROM owner_master WHERE uid = ?",[uid],(err,data)=>{
            if(err){
                
                return;
            }
    
            resolve(data)
        })
    
        
    
    });
}

ContactInfo.getAll = (userid,result)=>{
    sql.query("SELECT news.newsid,news.categoryid,news.title,news.thumbimg,news.isliked,news.isbookmarked,news.timestamp,category.title as category FROM news,category WHERE news.categoryid = category.categoryid;",(err,rows)=>{
        if(err){
            result(err,{status:"success",message:err,data:{}});
            
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            rows[i]['thumbimg'] = "http://localhost:8080"+rows[i]['thumbimg'];
        }
        // const fs = require('fs');
        // for (let i = 0; i < rows.length; i++) {
        //     let data = '';

        //     // Create a readable stream
        //         let readableStream = fs.createReadStream("D:/Skanda/Flutter Client Projects/Arun ZenAds/Tamil Defence News/Backend/nodejs-news-api"+rows[i]['thumbimg']);
            
        //         // Set the encoding to be utf8. 
        //         // readableStream.setEncoding('UTF8');
            
        //         // Handle stream events --> data, end,
        //         readableStream.on('data', function(chunk) {
        //         data += chunk;
        //         });
            
        //         readableStream.on('end', function(){
        //         console.log("Data : \n"+data);
        //         });
        // }

        
        

        checkisLiked(rows,userid).then((rows)=>{
            result(null,{status:"success",message:"News Fetched Successfully",data:{news:rows}});
        });
       
        
       
        
          
       
    })
}

ContactInfo.getNewsByCategory = (id,userid,result)=>{
    sql.query("SELECT * FROM news WHERE categoryid = ?",[id],(err,rows)=>{
        if(err){
            result(err,{status:"success",message:err,data:{}});
            
            return;
        }

        for (let i = 0; i < rows.length; i++) {
            rows[i]['thumbimg'] = "http://localhost:8080"+rows[i]['thumbimg'];
          }
          

       
          checkisLiked(rows,userid).then((rows)=>{
            result(null,{status:"success",message:"News Fetched Successfully",data:{news:rows}});
        });
    })
}


ContactInfo.delete = (newsid,result)=>{
    sql.query("DELETE FROM news WHERE newsid = ?",[newsid],(err,res)=>{
        if(err){
            result(err,{status:"failure",message:err,data:{}});
            return;
        }

       
        
        result(null,{status:"success",message:"News Deleted Successfully",data:{}});
    })
}



ContactInfo.addLike = (model,result)=>{
    sql.query("SELECT COUNT(*) as count FROM likes WHere  userid = ? AND newsid = ?",[model[0],model[1]],(err,res)=>{
        if(err){
            result(err,{status:"success",message:err,data:{}});
            console.log('Like Checking Failed due to '+err);
            return;
        }
        if(res[0]['count'] > 0){
            sql.query("DELETE FROM likes WHERE userid = ? AND newsid = ?",[model[0],model[1]],(err,res)=>{
                if(err){
                    result(err,{status:"success",message:err,data:{}});
                    console.log('Like Deletion Failed due to '+err);
                    return;
                }
                console.log('Like Deleted successfully');
                result(null,{status:"success",message:"Like Deleted Successfully",data:{id:res.insertId}});
            })
        }else{
            sql.query("INSERT INTO likes SET userid = ?,newsid = ?",[model[0],model[1]],(err,res)=>{
                if(err){
                    result(err,{status:"success",message:err,data:{}});
                    console.log('Like Insertion Failed due to '+err);
                    return;
                }
                console.log('Like Added successfully');
                result(null,{status:"success",message:"Like Added Successfully",data:{id:res.insertId}});
            })
        }
        // console.log('Like Added successfully');
        // result(null,{status:"success",message:"Like Added Successfully",data:{id:res.insertId}});
    })
    
    
}


ContactInfo.addBookamrk = (model,result)=>{
    sql.query("SELECT COUNT(*) as count FROM bookmarks WHere  userid = ? AND newsid = ?",[model[0],model[1]],(err,res)=>{
        if(err){
            result(err,{status:"success",message:err,data:{}});
            console.log('Like Checking Failed due to '+err);
            return;
        }
        if(res[0]['count'] > 0){
            sql.query("DELETE FROM bookmarks WHERE userid = ? AND newsid = ?",[model[0],model[1]],(err,res)=>{
                if(err){
                    result(err,{status:"success",message:err,data:{}});
                    console.log('Like Deletion Failed due to '+err);
                    return;
                }
                console.log('Bookmark Deleted successfully');
                result(null,{status:"success",message:"Like Deleted Successfully",data:{id:res.insertId}});
            })
        }else{
            sql.query("INSERT INTO bookmarks SET userid = ?,newsid = ?",[model[0],model[1]],(err,res)=>{
                if(err){
                    result(err,{status:"success",message:err,data:{}});
                    console.log('Like Insertion Failed due to '+err);
                    return;
                }
                console.log('Bokmark Added successfully');
                result(null,{status:"success",message:"Like Added Successfully",data:{id:res.insertId}});
            })
        }
        // console.log('Like Added successfully');
        // result(null,{status:"success",message:"Like Added Successfully",data:{id:res.insertId}});
    })
    
}

ContactInfo.getBookmarks = (userid,result)=>{
    sql.query("SELECT * FROM news,bookmarks WHERE bookmarks.newsid = news.newsid and bookmarks.userid = ?",[userid],(err,rows)=>{
        if(err){
            result(err,{status:"success",message:err,data:{}});
            
            return;
        }

        
        checkisLiked(rows,userid).then((rows)=>{
            result(null,{status:"success",message:"News Fetched Successfully",data:{news:rows}});
        });
    })
}

function checkisLiked(rows,userid){
    return new Promise(  (resolve, reject) => {

        sql.query("SELECT newsid FROM likes where userid = ?",[userid],(err,temp)=>{
            if(err){
                // result(err,{status:"success",message:err,data:{}});
                console.log(err);
                return;
            }
            
            // if(temp[0]['count'] > 0){
            //     rows[i]['isliked'] = "asdsa";
                
            // }else{
            //     rows[i]['isliked'] = "asdsa";
            // }
            for (let i = 0; i < rows.length; i++) {
           
                for (let j = 0; j < temp.length; j++) {
           
                    if(rows[i]['newsid'] == temp[j]['newsid']){
                        rows[i]['isliked'] = 1;
                    }
          
            
                }
          
            
            }
            
            // resolve(rows)
            checkisBookmarked(rows,userid).then((rows)=>{
                resolve(rows);
            })
            
        })
        
        
          
          
    });
}
function checkisBookmarked(rows,userid){
    return new Promise(  (resolve, reject) => {

        sql.query("SELECT newsid FROM bookmarks where userid = ?",[userid],(err,temp)=>{
            if(err){
                // result(err,{status:"success",message:err,data:{}});
                console.log(err);
                return;
            }
            
            // if(temp[0]['count'] > 0){
            //     rows[i]['isliked'] = "asdsa";
                
            // }else{
            //     rows[i]['isliked'] = "asdsa";
            // }
            for (let i = 0; i < rows.length; i++) {
           
                for (let j = 0; j < temp.length; j++) {
           
                    if(rows[i]['newsid'] == temp[j]['newsid']){
                        rows[i]['isbookmarked'] = 1;
                    }
          
            
                }
          
            
            }
            
            resolve(rows)
            
        })
        
        
          
          
    });
}

module.exports = ContactInfo;