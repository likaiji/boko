/**
 * Created by Administrator on 2017/3/8.
 */
var express=require("express");
var router=express.Router();
var fs=require("fs");  //fs为node的一个读取文件模块


//设置存放数据的json路径
var path="./public/jsons/articleData.json";
var userpath="./public/jsons/userData.json";

//配置一个默认界面，如果没有index.html，就会显示这个界面的内容
router.get('/',function(req,res){
    console.log("路由界面---没有index.js，你就进来了！！！");
    res.type("text/html");
    res.send("---welcome---");
});

//write写文章
router.get("/write",function(req,res){
    if(req.session.user){
        res.render("write",{layout:"main2.hbs"});
    }else{
        res.render("write");
    }
});

//展示文章
router.get("/aiticleShow",function(req,res){
    if(req.session.user){
        res.render("aiticleShow",{layout:"main2.hbs"});
    }else{
        res.render("aiticleShow");
    }
});

//write写文章的插入图片路由
var formidable=require("formidable");
var fs=require("fs");
const AVATAR_UPLOAD_FOLDER="/avatar/";
router.post("/writeContent",function(req,res){
    console.log("------前台传入了图片信息------");
    var form = new formidable.IncomingForm();
    form.encoding="utf-8"; //设置编辑
    form.uploadDir="public"+AVATAR_UPLOAD_FOLDER; //设置文件长传路劲的暂时保存路径
    form.keepExtensions=true; //保持后缀名
    form.parse(req,function(err,fields,files){
        console.log(files);
        if(err){
            console.log("文件错误！！！")
        }
        var extName=""; //后缀名
        switch(files.myfile.type){
            case "image/pjpeg":extName="jpg";break;
            case "image/jpeg":extName="jpg";break;
            case "image/png":extName="png";break;
            case "image/x-png":extName="jpg";break;
            case "image/gif":extName="gif";break;
        } //根据格式修改后缀名

        ////因为是在windows系统下，，，路劲符号是\,所以要注意加上一个转义符
        var timepoint=Date.now();

        //表示把新命名的文件放在public下的avatar_2里面
        var newPath="public\\avatar_2\\"+timepoint+"."+extName;

        fs.renameSync(files.myfile.path,newPath);

        //表示发往前台页面的文件名以及地址
        var webPath="avatar_2/"+timepoint+"."+extName;
        res.send(webPath);
    })
});

//标题部分选择图片路由
router.post("/sendTitleImg",function(req,res){
    console.log("------标题中：前台传入了图片信息------");
    var form = new formidable.IncomingForm();
    form.encoding="utf-8"; //设置编辑
    form.uploadDir="public"+AVATAR_UPLOAD_FOLDER; //设置文件长传路劲的暂时保存路径
    form.keepExtensions=true; //保持后缀名
    form.parse(req,function(err,fields,files){
        console.log(files);
        if(err){
            console.log("文件错误！！！")
        }
        var extName=""; //后缀名
        switch(files.myfile.type){
            case "image/pjpeg":extName="jpg";break;
            case "image/jpeg":extName="jpg";break;
            case "image/png":extName="png";break;
            case "image/x-png":extName="jpg";break;
            case "image/gif":extName="gif";break;
        } //根据格式修改后缀名

        ////因为是在windows系统下，，，路劲符号是\,所以要注意加上一个转义符
        var timepoint=Date.now();

        //表示把新命名的文件放在public下的avatar_2里面
        var newPath="public\\avatar_2\\"+timepoint+"."+extName;

        fs.renameSync(files.myfile.path,newPath);

        //表示发往前台页面的文件名以及地址
        var webPath="avatar_2/"+timepoint+"."+extName;
        res.send(webPath);
    })
});

//点击提交以后路由
router.post("/jsonData",function(req,res){
    //读取文件里面的数据
    fs.readFile(path,function(err,data){
        if(err){
            var newarticleData={
                datas:[
                    req.body
                ]
            };
            fs.writeFile(path,JSON.stringify(newarticleData),function(err){
                if(err){console.log(err)}
                res.send(req.body.id);
            })
        }else{
            var dataArray = JSON.parse(data.toString('utf-8')).datas;
            dataArray.push(req.body);
            var articles ={
                datas: dataArray
            };
            fs.writeFile(path,JSON.stringify(articles),function (err) {
                if(err){console.log(err)}
                res.send(req.body.id);
            });
        }
    })
});

//验证码路由
var yanzhengma=require("../lib/captcha");
router.get("/yanzhengma",yanzhengma.captchap);


//直接登录login页面，渲染login模板（get）
router.get("/login",function(req,res){
    //用户直接点击登路，但是没多久前就登陆过，进行判断
    var obj=req.session.user;
    if(obj){
        return res.redirect("/userDetail?name="+req.session.user.username+"&pwd="+req.session.user.password);
    }else{
        //如果没有用户输入信息，进入login页面
        res.render("login");
    }
});


//form表单提交的登录路由(post)
router.post("/loginData",function(req,res){
    console.log(req.body);
    fs.readFile(userpath,function(err,data){
        if(err){res.send("error")}
        else{
            var userdata=JSON.parse(data.toString("utf-8")).datas;
            var userflag=0;
            console.log("验证码是："+req.session.checkcode);
            for(var i=0;i<userdata.length;i++){
                if(req.body.username==userdata[i].username && req.body.password==userdata[i].password && req.body.passsure==req.session.checkcode){
                    //将用户数据存到session
                    req.session.user=req.body;
                    req.session.user.userid=userdata[i].userNum;
                    //重定向(重新改写地址栏，重新发起一个请求  get方法)
                    var backMsg="/userDetail?userid="+userdata[i].userNum;
                    res.send(backMsg);
                    userflag=1;
                    break;  //终止整个for循环
                }else if(req.body.passsure != req.session.checkcode  && req.body.username==userdata[i].username && req.body.password==userdata[i].password){
                    userflag=2;  //验证码错误
                }
            }

            if(userflag==0){
                res.send("0");
            }else if(userflag==2){
                res.send("2");
            }
        }
    });

});

//注册页面加载
router.get("/regist",function(req,res){
    if(req.session.user){
        res.render("regist",{layout:"main2.hbs"});
    }else{
        res.render("regist");
    }
});

//提交注册表单路由
router.post("/registData",function(req,res){
    var userNum=Date.now();
    console.log(req.body);
    console.log("验证码是："+req.session.checkcode);

    if(req.session.checkcode!=req.body.passsure){
        res.send("error");
    }else{
        //读取文件
        fs.readFile(userpath,function(err,data){
            if(err){
                var userData={
                    datas:[
                        {
                            "userNum":userNum,
                            "userImg":"images/me.jpg",
                            "username":req.body.username,
                            "password":req.body.password,
                            "passwordsure":req.body.passwordsure,
                            "sex":req.body.sex,
                            "phone":req.body.phone,
                            "passsure":req.body.passsure
                        }
                    ]
                };
                fs.writeFile(userpath,JSON.stringify(userData),function(err){
                    if(err){console.log(err)}
                    req.session.user="";
                    res.send("/login")
                });
            }else{
                var userDataArry=JSON.parse(data.toString("utf-8")).datas;
                var nowUserArr= {
                    "userNum":userNum,
                    "userImg":"images/me.jpg",
                    "username":req.body.username,
                    "password":req.body.password,
                    "passwordsure":req.body.passwordsure,
                    "sex":req.body.sex,
                    "phone":req.body.phone,
                    "passsure":req.body.passsure
                };
                userDataArry.push(nowUserArr);
                var users={
                    datas:userDataArry
                };
                fs.writeFile(userpath,JSON.stringify(users),function(err){
                    if(err){console.log(err)}
                    req.session.user="";
                    res.send("/login")
                });
            }
        })
    }
});

//文章详情页面取页面的值
router.post("/getAiticleShow",function(req,res){
    //获取上一页面的对象的url
    var jsonurl= req.body.url;
    // console.log(typeof  jsonurl);  //字符串

    fs.readFile(path,function(err,data){
        if(err){console.log(err)}
        var jsonContet=JSON.parse(data.toString("utf-8")).datas;

        //遍历这个json文件里面的数组
        jsonContet.forEach(function(el){
            if(jsonurl==el.id){
                console.log(el);
                res.send(el);
                return;
            }
        })
    });
});

//点击下线，退出登录，清除session
router.post("/exit",function(req,res){
    req.session.user="";
    req.session.user.userid="";
    res.send("aaa");
});

//登录以后导航栏取得用户名的session
router.post("/getUser",function(req,res){
    res.send(req.session.user);
});

module.exports=router;


