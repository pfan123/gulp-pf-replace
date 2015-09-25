//Gulp默认使用buffer

var through = require("through-gulp");  //引入gulp插件模块
var fs = require("fs");
var http = require("http");
var path = require("path");
var source = require('vinyl-source-stream'); //常规流转换为gulp支持的Vinyl文件格式
var gutil = require('gulp-util'); 
 //gulp多功能的插件，可以替换扩展名，log颜色日志，模板

 // 监测的是buffer 判断文件编码，针对buffer
 var jschardet = require("jschardet");

var chalk = require('chalk'); //设置颜色


// 类型判断
function isType(type){
    return function(o){
        return Object.prototype.toString.call(o) === '[object ' + type + ']';
    }
}

var isString = isType("String");
var isObject = isType("Object");
var isArray = isType("Array");
var i=0;

//gulp插件原理就是一个流进入，流处理完出来
function replace(modReplace) {
	
  //通过through创建流stream
  var stream = through(function(file, encoding,callback) {
	//file为对象，含有path,clone,pipe,inspect,history,isNull,isDirectory 等，常用的是path
	//console.log(isObject(file));
	
    //进程文件判断
    if (file.isNull()) {
		throw "NO Files,Please Check Files!"
    }
	
	//buffer对象可以操作
    if (file.isBuffer()) {
		//拿到单个文件buffer
		var content = file.contents;
		
		//监测是utf-8
		if(jschardet.detect(content).encoding.toUpperCase() == "UTF-8"){
			//将buffer转换成字符串才能处理
			content = modReplace(file.contents.toString("utf-8"));
			content = content.replace(/charset\=(gbk2318|gbk|gb2312)/ig,"charset=utf-8");
			this.push(file);
			i++;
		}else{
			gutil.log( gutil.colors.red(file.path+"文件格式不正确，请更改为utf-8") );
		}

		file.contents = new Buffer(content,"utf-8");
    }
	
	//stream流是不能操作的,可以通过fs.readFileSync
    if (file.isStream()) {
		//同步读取
		 var content = modReplace(fs.readFileSync(file.path).toString("utf-8"));
		 file.contents = new Buffer(content,"utf-8");
		 this.push(file);
		 i++;
    }
	
    // just pipe data next, or just do nothing to process file later in flushFunction 
    // never forget callback to indicate that the file has been processed. 
    
      callback();
    },function(callback) {
		gutil.log( gutil.colors.red(i) ,  gutil.colors.green("已经处理完毕！"));
      // just pipe data next, just callback to indicate that the stream's over 
     // this.push(something);
      callback();
    });
	
  //返回这个流文件
  return stream;
};
 
// 导出插件 
module.exports = replace;




