/**
 * Created by Administrator on 2017/3/8.
 */
$(function(){

    /*轮播部分*/
    function index(n){
        var index=0;//获取下标

        //定义方法
        function scollImg(index){
            var imgHeight=document.getElementById("m1").height;
            //console.log(index);
            document.getElementById("carouselBoxRightImg").style.marginTop=-(imgHeight*index)+"px";

            //获取的这个地址有端口号，所以需要拆分
            var imgnextShowSrcOne=document.getElementsByClassName("imgshow")[index].src;


            //上一张图片淡出
            $("#carouselBoxLeftImg").fadeOut("9000");
            //下一张淡入
            $("#carouselBoxLeftImg").fadeIn("9000");

            //获取即将出现的这个图片地址，只有images开头的那个
            var imgnextShowSrc=imgnextShowSrcOne.split("2300/")[1];

            document.getElementById("carouselBoxLeftImg").src=imgnextShowSrc;
        }

        //定时间   2s 换一张图
        num=0;
        setInterval(function(){
            num++;
            if(num==7){
                num=0;
            }
            scollImg(num);  //执行前面的scollImg方法
        },2000);

    }
    index(8);


    var userContentTitleLength=document.getElementsByClassName("userContentTitle").length;
    for(var i=0;i<userContentTitleLength;i++){
        (function(i){
            document.getElementsByClassName("userContentTitle")[i].onclick=function(){
                var artileId=document.getElementsByClassName("articleId")[i].innerHTML;
                window.location.href="/aiticleShow?data="+artileId;
            };
        })(i)
    }




});

//ng-repeat循环热门专题部分
var app=angular.module("simpleBook",[]);

app.controller("hotPoint",["$http",function($http){
        var self=this;
        self.data=[
            {
                img:"images/headerPicture/hpicturefive.jpeg",
                title:"散文"
            },
            {
                img:"images/headerPicture/hpicturefour.jpg",
                title:"想法"
            },
            {
                img:"images/headerPicture/hpicturesix.jpeg",
                title:"大学生活"
            },
            {
                img:"images/headerPicture/hpicturethree.jpg",
                title:"音乐"
            },
            {
                img:"images/headerPicture/hpicturetwo.jpg",
                title:"美人说"
            },
            {
                img:"images/headerPicture/it.jpg",
                title:"@IT;互联网"
            },
            {
                img:"images/headerPicture/kungfu.jpg",
                title:"武侠江湖"
            }
        ]
    }]);


//ng-repeat循环热门文章部分
app.controller("hotarticle",["$http",function($http){
        var self=this;

        self.data=[];  //初始化这个data数组

        $http.get("jsons/articleData.json").then(function(res){

            // console.log(res.data.datas);

            res.data.datas.forEach(function(el){
                var dataArry={};  //初始化这个数组

                //res.data表示获取到angular的ajax返回来的数据
                dataArry.aritcleId=el.id;
                dataArry.aritcleTitle=el.title;
                dataArry.headerImg=el.titleImg;
                dataArry.articlecontent=el.content;


                    var time=new Date(parseInt(el.id));
                    var year=time.getFullYear();
                    var month=time.getMonth()+1;
                    var days=time.getDate();
                    var hour=time.getHours();
                    var minutes=time.getMinutes();
                    var seconds=time.getSeconds();
                    var showTime=year+"年"+month+"月"+days+"日"+hour+"时"+minutes+"分"+seconds+"秒";
                dataArry.writeTime=showTime;
                self.data.push(dataArry);
            });
        });
    }]);

/* app表示前面绑定的ng-app的值     trustHtml表示前台的ng-bind-html的值*/
app.filter('trustHtml', function ($sce) {
    return function (input) {
        return $sce.trustAsHtml(input);
    }
});

