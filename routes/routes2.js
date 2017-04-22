/**
 * Created by Administrator on 2017/3/23.
 */
var express=require("express");
var router=express.Router();
var fs=require("fs");

var userpath="./public/jsons/userData.json";

//用户详细资料路由（get）
router.get("/userDetail",function(req,res){

    var userid=req.query.userid;

    //地址栏参数存在
    if(userid){
        fs.readFile(userpath,function(err,data){
            if(err){
                console.log("fs读取文件错误");
            }else{
                var userdata=JSON.parse(data.toString("utf-8")).datas;
                userdata.forEach(function(el){
                    if(userid==el.userNum){
                        var getObjUpdate={
                            username:el.username,
                            userimg:el.userImg,
                            pwd:el.password,
                            sex:el.sex,
                            phone:el.phone
                        };
                        res.render("userDetail",{layout:'userBackMain.hbs',aaa:getObjUpdate});
                        return false;
                    }
                })
            }
        });
    }
    //地址栏参数不存在
    else{
        fs.readFile(userpath,function(err,data){
            if(err){
                console.log("fs读取文件错误");
            }else{
                var userdata=JSON.parse(data.toString("utf-8")).datas;
                userdata.forEach(function(el){
                    if(req.session.user.userid==el.userNum){
                        var getObjUpdate={
                            username:el.username,
                            userimg:el.userImg,
                            pwd:el.password,
                            sex:el.sex,
                            phone:el.phone
                        };
                        res.render("userDetail",{layout:'userBackMain.hbs',aaa:getObjUpdate});
                        return false;
                    }
                })
            }
        });
    }


});

//加载修改用户资料页面
router.get("/changeUserData",function(req,res){
    console.log(req.session.user.userid);
    fs.readFile(userpath,function(err,data){
        if(err){console.log(err)}
        else{
            var userJson=JSON.parse(data.toString("utf-8")).datas;
            for(var i=0;i<userJson.length;i++){
                if(req.session.user.userid==userJson[i].userNum){
                   var getObjUpdate={
                        username:userJson[i].username,
                        userimg:userJson[i].userImg,
                        pwd:userJson[i].password,
                        sex:userJson[i].sex,
                        phone:userJson[i].phone
                     };
                    res.render("changeUserData",{layout:"userBackMain.hbs",aaa:getObjUpdate});
                    break;
                }
            }
        }
    })
});


//修改用户头像
var formidable=require("formidable");
const AVATAR_UPLOAD_FOLDER="/avatar/";
router.post("/getuserImg",function(req,res){
    console.log("---------照片上传！！！-------------");
    var form=new formidable.IncomingForm();
    form.encoding="utf-8";  //设置编辑
    form.uploadDir="public"+AVATAR_UPLOAD_FOLDER;
    form.keepExtensions=true;
    form.parse(req,function(err,fields,files){
        console.log(files);
        if(err){
            console.log("文件错误")
        }
        var extName="";  //后缀名
        switch(files.myfile.type){
            case "image/pjpeg":extName="jpg";break;
            case "image/jpeg":extName="jpg";break;
            case "image/png":extName="png";break;
            case "image/x-png":extName="jpg";break;
            case "image/gif":extName="gif";break;
        };//根据格式修改后缀名

        //因为是在windows系统下，，，路劲符号是\,所以要注意加上一个转义符
        var timepoint = Date.now();//获取但当前时间（从1970年到现在的毫秒数）
        var newPath="public\\avatar_2\\"+timepoint+"."+extName;  //表示把新命名的文件放在public下的avatar_2里面
        fs.renameSync(files.myfile.path,newPath);
        var webPath="avatar_2/"+timepoint+"."+extName;  //表示发往前台页面的文件名以及地址
        res.send(webPath);
    })
});

//修改用户资料提交的form表单
router.post("/updateUser",function(req,res){
    fs.readFile(userpath,function(err,data){
        if(err){console.log(err)}
        else{
            var userJson=JSON.parse(data.toString("utf-8")).datas;
            userJson.forEach(function(el){
                if(req.session.user.userid==el.userNum){
                    //获取这元素在数组中的位置，并删除这个数组
                    var userData=el;
                    var userLocation=0;
                    for(var i=0;i<userJson.length;i++){
                        if(userJson[i]==userData){
                            userLocation=i;
                            //删除数组
                            userJson.splice(userLocation,1);
                            //重新定义一个数组，push到json里面
                            var newUserArr= {
                                "userNum":req.session.user.userid,
                                "userImg":req.body.userImgUrl,
                                "username":el.username,
                                "password":req.body.password,
                                "passwordsure":req.body.password,
                                "sex":req.body.sex,
                                "phone":req.body.phone,
                                "passsure":el.passsure
                            };
                            userJson.push(newUserArr);
                            //重新组合一个新数组，重新写入json文件
                            var newUserData={
                                datas:userJson
                            };
                            fs.writeFile(userpath,JSON.stringify(newUserData),function(err){
                                if(err){console.log(err)}
                                res.render("changeUserDataSuccess",{layout:"userBackMain"});
                            });
                            return;
                        }
                    }
                    return;
                }
            })
        }
    })
});


module.exports=router;