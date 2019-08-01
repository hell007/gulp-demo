const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const sass = require('gulp-sass')
const combiner = require('stream-combiner2')
//const minifycss = require('gulp-minify-css')
const base64 = require('gulp-base64')

gulp.task('sass', function() {

	let combined = combiner.obj([

		//监听sass目录下的全部scss, 也可以更改为只监听某一个scss文件
		gulp.src(['./src/styles/*.scss']),
		sass({outputStyle: 'expanded'}).on('error', sass.logError),

		// 图片base64
		base64({
      baseDir: './src/images',
      extensions: ['svg', 'png', /\.jpg#datauri$/i],
      exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
      maxImageSize: 8*1024, // bytes
      debug: true
  	}),

		//自动处理前缀
		autoprefixer([
			'iOS >= 8',
			'Android >= 4.1',
			'Chrome > 31',
      'ff > 31'
		]),

		//文件压缩，可选择性开启 默认不会开启
		//minifycss(), 

		//所有文件输出出口从project为根节点
		gulp.dest('./src/styles')
	]);
});

//在gulp4.0之后已经只能接受watch第二个参数必须为函数。
gulp.task('default', function() {
	gulp.watch('./src/styles/*.scss', gulp.series('sass'));
});
