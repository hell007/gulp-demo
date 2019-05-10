const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const combiner = require('stream-combiner2')
const minifycss = require('gulp-minify-css')

gulp.task('sass', function() {

	let combined = combiner.obj([

		//监听sass目录下的全部scss, 也可以更改为只监听某一个scss文件
		gulp.src(['./src/**/*.{wxss,scss}']),
		sass({outputStyle: 'expanded'}).on('error', sass.logError),

		//自动处理前缀
		autoprefixer([
			'iOS >= 8',
			'Android >= 4.1'
		]),

		//文件压缩，可选择性开启 默认不会开启
		//minifycss(), 

		//所有文件输出出口从project为根节点
		gulp.dest('./src')
	]);
});

//在gulp4.0之后已经只能接受watch第二个参数必须为函数。
gulp.task('default', async() => {
   gulp.series('sass')
});
