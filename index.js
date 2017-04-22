var express=require("express"); //需要一个三方插件
var app=express(); //实例化这个三方插件

//使用body-parser解析表单数据
app.use(require("body-parser")());

//设置handlebars视图引擎以及视图目录文件
var handlebars=require("express-handlebars")
    .create({
        defaultLayout:"main",//设置默认母版为main
        extname:'.hbs',  //设置模板引擎文件后缀为 .hbs

        //创建一个handlebars辅助函数,让它给出一个到静态资源的链接
        helpers:{
            static:function(name){
                return require("./lib/static.js").map(name);
            },
            section:function(name,options){
                if(!this._sections)this._sections={};
                this._sections[name]=options.fn(this);
                return null;
            }
        }
    });
app.engine("hbs",handlebars.engine);
app.set("view engine","hbs");

//静态资源
app.use(express.static(__dirname+"/public"));
app.set("port",process.env.PORT || 2300);  //端口号

//session
var cookieParser=require('cookie-parser');      //将cookie-parser设置为cookieParser
var session=require('express-session');
app.use('/',cookieParser('sessiontest'));
app.use('/',session({
    secret:'sessiontest',//与cookieParser中的一致
    cookie:{ maxAge:6000000},
    resave:true,
    saveUninitialized:true
}));

//配置一个默认界面
var router=require("./routes/routes.js");
var router2=require("./routes/routes2.js");
app.use("/",router);
app.use("/",confirm);
app.use("/",router2);
function confirm(req,res,next){
    //用户存在
    if(req.session.user){
        next();
    }
    //用户不存在
    else{
        return res.redirect("/login");
    }
}


//404
app.use(function(req,res){
    res.type("text/html");
    res.status(404);
    res.render("errors/404",{layout:"error"});
});

//500
app.use(function(req,res,err,next){
    console.log(err,stack);
    res.type("text/plain");
    res.status(500);
    res.render("errors/500.hbs",{layout:"error"});
});

app.listen(app.get("port"),function(){
    console.log("This port is :"+app.get("port"));
});