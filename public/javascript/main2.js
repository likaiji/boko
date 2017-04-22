/**
 * Created by Administrator on 2017/3/29.
 */
$(function(){
    //取session值
    $.ajax({
        type:"POST",
        url:"/getUser",
        dataType:"text",
        success:function(data){
            var userObj=JSON.parse(data);
            console.log(userObj.username);
            document.getElementById("username").innerHTML=userObj.username;
        }
    });

    //点击下线
    document.getElementById("exit").onclick=function(){
        window.location.href="/login";
        $.ajax({
            type:"POST",
            url:"/exit",
            dataType:"text",
            success:function(data){
                console.log(data);
            }
        })
    }
});