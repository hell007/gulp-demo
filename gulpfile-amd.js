/**
 * gulp-requirejs-optimize的使用: https://github.com/jlouns/gulp-requirejs-optimize
 */


//引入gulp
var gulp = require('gulp');


//引入组件
var concat = require('gulp-concat'),           //合并
	jshint = require('gulp-jshint'),           //js规范验证
	uglify = require('gulp-uglify'),           //压缩
	rename = require('gulp-rename'),          //文件名命名
	htmlmin = require('gulp-htmlmin'),
	clean = require('gulp-clean'),
	md5 = require('gulp-md5-plus'),
	requirejsOptimize = require('gulp-requirejs-optimize');   //require优化




//脚本检查
gulp.task('lint', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

//资源拷贝
gulp.task('copy:html', function (done) {
    gulp.src(['src/*.html']).pipe(gulp.dest('dist/')).on('end', done);
});

gulp.task('copy:jslib', function (done) {
    gulp.src(['src/js/lib/*.js']).pipe(gulp.dest('dist/js/lib/')).on('end', done);
});

gulp.task('copy:config', function (done) {
    gulp.src(['src/js/config.js']).pipe(gulp.dest('dist/js/')).on('end', done);
});


//压缩html
gulp.task('minifyhtml', function() {
  return gulp.src('src/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});


//require合并

//单页面合并
gulp.task('index', function () {
    gulp.src('./src/js/index/*.js')
        .pipe(requirejsOptimize({ //require config
            mainConfigFile: 'src/js/config.js',
            exclude: [
                'jquery',
                'underscore'
            ]
        }))
        .pipe(concat("index.js"))           //合并
        .pipe(rename("index.min.js"))     //重命名
        .pipe(uglify())                     //压缩
        .pipe(gulp.dest("dist/js/index/")); //输出保存
});


//多页面合并
gulp.task('minifyjs', function () {
    gulp.src('./src/js/page/*.js')
        .pipe(requirejsOptimize({ //require config
            mainConfigFile: 'src/js/config.js',
            exclude: [
                'jquery',
                'underscore'
            ]
        }))
        .pipe(uglify())                     //压缩
        .pipe(gulp.dest("dist/js/page/")); //输出保存
});

//将js加上10位md5
gulp.task('md5:js', ['minifyjs'], function (done) {
    gulp.src('dist/js/page/*.js')
        .pipe(gulp.dest('dist/js/page/'))
        .on('end', done);
});


////单页面
//gulp.task('default', function () {
//  gulp.run('lint', 'index');
//});


//开发 默认的default任务  gulp
gulp.task('default',['copy:html','copy:jslib','copy:config','minifyjs']);


//部署
gulp.task('build',['minifyhtml','copy:jslib','copy:config','minifyjs']);
