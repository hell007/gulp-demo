
var gulp = require('gulp'),
    less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	htmlmin = require('gulp-htmlmin'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
	spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    md5 = require('gulp-md5-plus');

//将不进行操作的资源拷贝到目标目录
gulp.task('copy:html', function (done) {
    gulp.src(['src/*.html']).pipe(gulp.dest('dist/')).on('end', done);
});

gulp.task('copy:iconfont', function (done) {
    gulp.src(['src/css/iconfont/**/*']).pipe(gulp.dest('dist/css/iconfont')).on('end', done);
});

//将不进行操作的图片拷贝到目标目录
gulp.task('copy:absolute', function (done) {
    gulp.src(['src/css/absolute/**/*']).pipe(gulp.dest('dist/css/absolute')).on('end', done);
});

//将不进行操作的图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src(['src/images/**/*']).pipe(gulp.dest('dist/images')).on('end', done);
});

//将图片拷贝到目标目录,然后进行合并
gulp.task('copy:slice', function (done) {
    gulp.src(['src/css/slice/**/*']).pipe(gulp.dest('dist/css/slice')).on('end', done);
});

//js检测
gulp.task('jshint',function(){
	return gulp.src('src/js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

//合并html
gulp.task('minifyhtml', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


//压缩css less 若需要合并css 需要引入合并模块
gulp.task('minifycss',function() {
    return gulp.src(['src/css/**/*.less', 'src/css/**/*.css'])
        .pipe(less())
        //.pipe(rename({suffix:'.min'}))//重命名
        .pipe(minifycss())   //压缩
        //.pipe(concat('style.min.css'))
        .pipe(gulp.dest('dist/css'))   //输出文件夹
});

//雪碧图操作，应该先拷贝图片,然后压缩css
gulp.task('sprite', ['copy:slice', 'minifycss'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/css/*.css')
        .pipe(spriter({
            spriteSheet: 'dist/css/slice/sprite' + timestamp + '.png',
            pathToSpriteSheetFromCSS: 'slice/sprite' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});

    
//合并压缩js
gulp.task('minifyjs',function(){
	return gulp.src('src/js/**/*.js')
		//.pipe(concat('main.js')) //合并
        //.pipe(rename({suffix:'.min'}))//重命名
		.pipe(uglify())//压缩
		.pipe(gulp.dest('dist/js'));//输出
});

//将js加上10位md5
gulp.task('md5:js', ['minifyjs'], function (done) {
    gulp.src('dist/js/*.js')
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});

//清除
gulp.task('clean', function (done) {
    gulp.src(['dist'])
        .pipe(clean())
        .on('end', done);
});

//默认的default任务  gulp
gulp.task('default',['copy:iconfont', 'copy:absolute', 'copy:images', 'minifyhtml', 'sprite', 'minifyjs']);
