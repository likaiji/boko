/**
 * Created by Administrator on 2017/3/10.
 */
$(function(){
    console.log("上一页面传入地址信息"+location.href);

    //以 data= 拆分
    var url=location.href.split("data=")[1];
    console.log("第一次拆分地址："+url);

    var arr={};
    arr.url=url;

    //通过ajax取值，$.get是取一个json文件
    $.ajax({
        type:"POST",
        url:"/getAiticleShow",
        dataType:"text",
        data:arr,
        success:function(data){
            var dataObj=JSON.parse(data);
            console.log(dataObj.id);

            var time=new Date(parseInt(dataObj.id));
            var year=time.getFullYear();
            var month=time.getMonth()+1;
            var days=time.getDate();
            var hour=time.getHours();
            var minutes=time.getMinutes();
            var seconds=time.getSeconds();
            var showTime=year+"年"+month+"月"+days+"日"+hour+"时"+minutes+"分"+seconds+"秒";

            //渲染页面
            document.getElementById("articleTime").innerHTML=showTime;
            document.getElementById("aiticleShowTitle").innerHTML=dataObj.title;
            $("#authorLeft").append("<img src="+dataObj.titleImg+" width='100%' height='100%' alt='user'/>");
            $("#articleContent").append("<p>"+dataObj.content+"</p>");
        }
    })

});
