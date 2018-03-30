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
	rev = require('gulp-rev'),
	revCollector = require('gulp-rev-collector'),
	runSequence = require('run-sequence'),
	useref = require('gulp-useref'),
	revReplace = require('gulp-rev-replace'),
	requirejsOptimize = require('gulp-requirejs-optimize');   //require优化


//脚本检查
gulp.task('lint', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});


//清空文件夹，避免资源冗余
gulp.task('clean',function(){
    return gulp.src('dist/',{read:false}).pipe(clean());
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


//css文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出来
gulp.task('minifycss',function(){
    return gulp.src('./src/css/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('dist/css'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/css'))
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
//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出
gulp.task('minifyjs', function () {
    gulp.src('./src/js/page/*.js')
        .pipe(requirejsOptimize({ //require config
            mainConfigFile: 'src/js/config.js',
            exclude: [
                'jquery',
                'underscore'
            ]
        }))
        .pipe(uglify()) //压缩
        .pipe(rev())
        .pipe(gulp.dest('dist/js/page/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest("dist/js/page/")); //输出保存
});


//将所有的html文件复制到生产环境中去
gulp.task('minifyhtml', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: false,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: false,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src('dist/**/*.html')
    	.pipe(htmlmin(options))
        .pipe(gulp.dest('dist/'));
});


//通过hash来精确定位到html模板中需要更改的部分,然后将修改成功的文件生成到指定目录
gulp.task('rev',function(){
    return gulp.src(['dist/js/page/*.json','dist/css/*.json','./src/*.html'])
    .pipe( revCollector({
        replaceReved: true
    }))
    .pipe(gulp.dest('dist'));
});


//开发下
gulp.task('devjs', function () {
    gulp.src('./src/js/page/*.js')
        .pipe(uglify()) //压缩
        .pipe(gulp.dest("dist/js/page/")); //输出保存
});

gulp.task('devcss',function(){
    gulp.src('./src/css/**/*.css')
    	.pipe(gulp.dest('dist/css'))
});


//开发 默认的default任务  gulp
gulp.task('default',function(){
    runSequence('clean',['copy:html','copy:jslib','copy:config','devjs','devcss']);
});

//部署
gulp.task('build',function(){
	// 设置队列
	runSequence('clean',['copy:jslib','copy:config','minifyjs','minifycss'],'rev','minifyhtml');
});
