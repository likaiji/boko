
module.exports=function (grunt) {
    //配置
    grunt.initConfig({
        pkg:grunt.file.readJSON('package.json'),
        //检查Style CSS语法
        csslint:{
            src:['public/stylesheets/*.css']
        },
        //合并CSS文件
        concat:{
            css:{
                src:['public/stylesheets/*.css'],
                //根据目录下文件情况配置
                dest:'public/stylesheets/dist/<%=pkg.name%>.css'
            }
        },
        //压缩style CSS文件为  .min.css
        cssmin:{
            options:{
                //移出CSS文件中的所有注释
                keepSpecialComments:0
            },
            minify:{
                expand:true,
                cwd:'public/stylesheets/dist',
                src:['<%=pkg.name%>.css'],
                dest:'public/stylesheets/dist',
                ext:'.min.css'
            }
        },
        //检查JS语法
        jshint:{
            all:[
                'Gruntfile.js',
                'public/javascript/*.js'
            ]
        },
        //压缩JS文件
        uglify:{
            build:{
                src:'public/javascript/*.js',
                dest:'public/javascript/dist/<%=pkg.name%>.min.js'
            }
        },
        //监控
        watch:{
            css:{
                files:'public/stylesheets/*.css',
                tasks:['csslint'],  //只监控csslint语法
                options:{
                    spawn:false
                }
            },
            scripts:{
                files:'public/javascript/*.js',
                tasks:['jshint'],
                options:{
                    spawn:false
                }
            }
        }

    });

    //另一种加载插件写法：通过数组遍历....
    [
        'grunt-contrib-csslint',
        'grunt-contrib-concat',
        'grunt-contrib-cssmin',
        'grunt-contrib-jshint',
        'grunt-contrib-uglify',
        'grunt-contrib-watch'
    ].forEach(function (task){
            grunt.loadNpmTasks(task);
        });

    //默认任务
    grunt.registerInitTask('default',['concat','cssmin','uglify']);

    //静态任务用于前端静态资源
    grunt.registerInitTask('static',['csslint','jshint']);

};		