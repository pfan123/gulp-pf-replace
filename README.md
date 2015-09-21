# gulp-pf-replace
  gulp plugins make replace text.
  
#usage
  var replace = require("gulp-pf-replace");
#####  Define replace function
  	function ypReplace(data){
	  return data.replace(/帮宝适首发/,"123456")  
	}
	
	
#####  Define gulp task
	gulp.task("replace",function(){
		 gulp.src("./src/*.html")
		 .pipe(replace(ypReplace))
		 .pipe(gulp.dest("./out"));
	});
