/**
 * Created by Administrator on 2017/3/9.
 */
$(document).ready(function(){

    //只是负责将文本上传到服务器，然后在页面编辑框中呈现出来

    //初始化summernote
    $("#summernote").summernote({
        width:"100%",
        height:"380px",
        callbacks:{
            //当在summernote中发生选择事件后，进行上传信息
            onImageUpload:function(files){
                //遍历信息
                var len=files.length;
                for(var i=0;i<len;i++){
                    sendFile(files[i]);
                }
            }
        }
    });

    //上一步的sendFile方法
    function sendFile(file){
        data=new FormData();  //动态创建form表单的一个ectype属性
        data.append("myfile",file);
        $.ajax({
            data:data,
            type:"POST",
            url:"/writeContent",
            cache:false,
            contentType:false,
            processData:false,
            success:function(url){
                console.log("---后台返回来的url信息："+url);
                $("#summernote").summernote("insertImage",url); //表示将传回来的文件地址放到summernote里面，这个insertImage不能变
            }
        })
    }


    //input选择图片完后执行的代码
    document.getElementById("imgfile").onchange=function(){
        //传标题图片到后台处理
        var titleImg=$("#imgfile")[0]; //因为得到的是一个jquery类型，所以需要转化为js类型
        var titleImgFile=titleImg.files;  //获取上一步获取的titlefile对象里面的files属性名
        for(var i=0;i<titleImgFile.length;i++){
            sendTitleImg(titleImgFile[i],"ImgFile");  //执行上面的titleImgFile
        }
    };

    //标题input选择图片完后执行路由的代码
    function sendTitleImg(file){
        data=new FormData();  //动态创建form表单的一个ectype属性
        data.append("myfile",file);
        $.ajax({
            data:data,
            type:"POST",
            url:"/sendTitleImg",
            cache:false,
            contentType:false,
            processData:false,
            success:function(url){
                console.log("---标题：后台返回来的url信息："+url);
                $("#selectPictureurl").text(url);  //为这个id添加一个值保存图片地址，后面的路由会用
            }
        })
    }


    //点击提交以后路由
    $("#sub").click(function(){

        //后要处理标题，正文信息
       console.log("点击提交以后的路由开始信息");

        //定义一个空白对象
        var articlemsg={};

        //在这个空白路由对象里面设置一个text属性，并且设置为文本输入的所有信息
        articlemsg.id=Date.now();  //id
        articlemsg.title=document.getElementById("inputTitle").value;    //标题
        articlemsg.titleImg=document.getElementById("selectPictureurl").innerHTML;   //标题下方的图片地址
        articlemsg.content=$("#summernote").summernote("code");   //文本

        console.log(articlemsg);

        $.ajax({
            type:"POST",
            url:"/jsonData",
            dataType:"text",
            data:articlemsg,  //发送上面的整个articlemsg对象
            success:function(msg){
                console.log(msg);
                alert("文章发表成功！！！正在跳转，请稍后.....");
                var  newPath="/aiticleShow?data="+msg;
                window.location.href=newPath;  //跳转
            }
        })

    });

});