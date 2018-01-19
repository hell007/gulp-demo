
var gulp = require('gulp'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    base64 = require('gulp-base64'),
    md5 = require('gulp-md5-plus');

//将不进行操作的资源拷贝到目标目录
gulp.task('copy:html', function (done) {
    gulp.src(['src/*.html']).pipe(gulp.dest('dist/')).on('end', done);
});

// gulp.task('copy:iconfont', function (done) {
//     gulp.src(['src/css/iconfont/**/*']).pipe(gulp.dest('dist/css/iconfont')).on('end', done);
// });

//将不进行操作的图片拷贝到目标目录
gulp.task('copy:images', function (done) {
    gulp.src(['src/images/**/*']).pipe(gulp.dest('dist/images')).on('end', done);
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


//base64  这里可以把需要base64的图片放在独立文件夹，dist里面可以不用copy
gulp.task('base64', ['copy:images'], function () {
    return gulp.src('./dist/css/*.css')
        .pipe(base64({
            baseDir: './dist/images',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            exclude:    [/\.server\.(com|net)\/dynamic\//, '--live.jpg'],
            maxImageSize: 8*1024, // bytes 
            debug: true
        }))
        .pipe(gulp.dest('./dist/css'));
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
gulp.task('default',['copy:html', 'minifyjs', 'minifycss','base64']);

