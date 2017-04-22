
//更换验证码
function changeyanzhengma(){
    //如果不加flag="+Math.random()是实现不了局部刷新的功能的。因为src中如果每次访问的地址一样的话就会发生不更新的情况。
    $("#yanzhengma").attr("src","/yanzhengma?width=120&height=40&flag="+Math.random());
}

//登录验证
$(function(){
    document.getElementsByClassName("btncss")[0].onclick=function(){
        //获取登录表单输入数据
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        var passsure=document.getElementById("passsure").value;

        //判断是否为空
        if(username.length==0  || password.length==0 || passsure.length==0){
            alert("请输入正确的登录信息！");
        }else{
            //将表单数据组合成字符串传到后台ajaxx处理
            var userlogindata="username="+username+
                "&password="+password+
                "&passsure="+passsure;
            console.log(userlogindata);

            //ajax提交登录信息
            $.ajax({
                type:"POST",
                url:"/loginData",
                data:userlogindata,
                dataType:"text",
                success:function(data){
                    console.log(data);
                    if(data==0){
                        alert("用户名或密码错误，请重新输入...")
                    }else if(data==2){
                        alert("验证码错误，请重新输入...")
                    }else if(data=="error"){
                        alert("读取文件失败，请稍后再试!!!")
                    }
                    else{
                        alert("登录成功，正在跳转，请稍后.....");
                        window.location.href=data;
                    }
                },
                error:function(jqXHR){
                    alert("服务器错误，请稍后再试");
                }
            })


        }
        return false;
    };

});





