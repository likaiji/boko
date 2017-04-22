/**
 * Created by Administrator on 2017/3/10.
 */
$(function(){
    //阻止冒泡事件
    function zuzhi(e){
        if(e.stopPropagation){
            e.stopPropagation();
        }
        else{
            e.cancelBubble=true;
        }
    }


    document.getElementById("search").onclick=function(e){
        zuzhi(e);

        //获取搜索框的宽度
        var searchBoxWidth=document.getElementById("searchBox").clientWidth;
        console.log(searchBoxWidth);
        if(searchBoxWidth==140){
            document.getElementById("searchBox").style.width="200px";
            document.getElementById("search").style.width="150px";
        }
    };


    document.body.onclick=function(){
        //获取搜索框的宽度
        var searchBoxWidth=document.getElementById("searchBox").clientWidth;
        console.log(searchBoxWidth);
        if(searchBoxWidth==200){
            document.getElementById("searchBox").style.width="140px";
            document.getElementById("search").style.width="80px";
        }
    };

    //点击写文章，跳转页面
    document.getElementsByClassName("writeAritcle")[0].onclick=function(){
        window.location.href="/write";
    };

    //点击注册，跳转页面
    document.getElementsByClassName("regist")[0].onclick=function(){
        window.location.href="/regist";
    };
})