
//更换验证码
function changeyanzhengma(){
    //如果不加flag="+Math.random()是实现不了局部刷新的功能的。因为src中如果每次访问的地址一样的话就会发生不更新的情况。
    $("#yanzhengma").attr("src","/yanzhengma?width=120&height=40&flag="+Math.random());
}

//注册验证
$(function(){
    document.getElementsByClassName("btncss")[0].onclick=function(){

        //获取输入框的值
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        var passwordsure=document.getElementById("passwordsure").value;
        var sex=$("input[type='radio']:checked").val();
        var phone=document.getElementById("phone").value;
        var passsure=document.getElementById("passsure").value;

        //判断输入是否为空
        if(username.length==0 || password.length==0 ||passwordsure.length==0 || phone.length==0 || passsure.length==0){
            alert("输入信息不能为空！！！");
        }else{
            //将表单数据组合成字符串
            var userdata="username="+username+
                "&password="+password+
                "&passwordsure="+passwordsure+
                "&sex="+sex+
                "&phone="+phone+
                "&passsure="+passsure;
            console.log(userdata);

            //ajax提交表单数据
            $.ajax({
                type:"POST",
                url:"/registData",
                dataType:"text",
                data:userdata,
                success:function(data){
                    if(data=="error"){
                        alert("验证码错误！");
                    }
                    else{
                        alert("注册成功,正在跳转.....");
                        window.location.href=data;
                    }
                }
            });
        }

        return false;
    };

});