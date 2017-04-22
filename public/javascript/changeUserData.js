/**
 * Created by Administrator on 2017/3/30.
 */
$(function(){
    document.getElementsByClassName("userContentLeft")[0].getElementsByTagName("ul")[0].getElementsByTagName("li")[1].style.backgroundColor=" #F0F0F0";
    document.getElementsByClassName("userImgChange")[0].onclick=function(){
        console.log("aaa");
    };


    //点击更换图片
    $("#changePhoto").change(function(){
        var  file = $("#changePhoto")[0].files[0];
        
        //判断FileReader方法是否可用
        if(window.FileReader){
            //定义一个FileReader方法
            var fr=new FileReader();

            //加载执行FileReader方法
            fr.onloadend=function(e){
                document.getElementById("userPhoto").src=e.target.result;
            };


            //获取图片的信息
            var img = event.target.files[0];
            console.log(img);

            //将图片传到sendFile方法处理
            sendFile(img);


            //readAsDataURL：这是例子程序中用到的方法，该方法将文件读取为一段以 data: 开头的字符串，
            // 这段字符串的实质就是 Data URL，Data URL是一种将小文件直接嵌入文档的方案。这里的小文件通常是指图像与 html
            // 等格式的文件。
            fr.readAsDataURL(file);
        }
    });



    //更换图片的sendFile方法
    function sendFile(file){
        data = new FormData();
        data.append("myfile",file);
        $.ajax({
            data:data,
            type:"POST",
            url:"/getuserImg",
            cache:false,
            contentType:false,
            processData:false,
            success:function(url){
                console.log("用户更换头像以后的保存路径："+url);
                document.getElementById("userImgUrl").value=url;
            }
        });
    }

    //如果用户没有更换头像
    var userImg=document.getElementById("userPhoto").src;
    console.log(userImg.split("2300/")[1]);
    document.getElementById("userImgUrl").value=userImg.split("2300/")[1];
});