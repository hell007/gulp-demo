//引入gulp
var gulp = require('gulp');
//引入组件
var minimist = require('minimist'),
	  gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    combiner = require('stream-combiner2'),
    sourcemaps = require('gulp-sourcemaps'),
    minifycss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    handlebars = require('gulp-handlebars'),
    htmlmin = require('gulp-htmlmin'),
    assetRev = require('gulp-asset-rev'),//添加版本号,用来更新缓存，开发环境下可以使用,避免客户端总是清缓存的问题
    rev = require('gulp-rev'),//对文件名加MD5后缀,
    revCollector = require('gulp-rev-collector'),//路径替换，用来做非覆盖式发布，生产环境下使用
    clean = require('gulp-clean'),
    gulpSequence = require('gulp-sequence'),//控制执行顺序
    del = require('del');
    
//错误提示
var handleError = function (err) {
    var colors = gutil.colors;
    console.log('\n');
    gutil.log(colors.red('Error!'))
    gutil.log('fileName: ' + colors.red(err.fileName))
    gutil.log('lineNumber: ' + colors.red(err.lineNumber))
    gutil.log('message: ' + err.message)
    gutil.log('plugin: ' + colors.yellow(err.plugin))
}

//区分环境
//默认development环境 
var knowOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'dev'
    }
};
var options = minimist(process.argv.slice(2), knowOptions);
gutil.log(options);

//生成filename文件，存入string内容
function string_src(filename, string) {
    var src = require('stream').Readable({objectMode: true})
    src._read = function () {
        this.push(new gutil.File({cwd: "", base: "", path: filename, contents: new Buffer(string)}))
        this.push(null)
    }
    return src
}

gulp.task('constants', function () {
    //读入config.json文件
    var myConfig = require('./config.json');
    //取出对应的配置信息
    var envConfig = myConfig[options.env];
    var conConfig = 'appconfig = ' + JSON.stringify(envConfig);
    //生成config.js文件
    return string_src("config.js", conConfig)
        .pipe(gulp.dest('dist/js/'))
});

//压缩js
gulp.task('uglifyjs', function () {
    if (options.env == 'test') {
        uglifyjs('test');
    }
    else {
        uglifyjs('production')
    }
});
function uglifyjs(path) {
    var combined = combiner.obj([
        gulp.src('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/js/*.js'),
        sourcemaps.init(),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/js/')
    ]);
    combined.on('error', handleError)
}

//压缩css
gulp.task('mincss', function () {
    if (options.env == 'test') {
        mincss('test')
    }
    else {
        mincss('production')
    }
    function mincss(path) {
        gulp.src('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/css/*.css')
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: 'last 2 versions'
            }))
            .pipe(minifycss())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/css'))
    }
})

//压缩html
gulp.task('minifyhtml', function () {
    if (options.env == 'test') {
        minifyhtml('test')
    }
    else {
        minifyhtml('production')
    }
    function minifyhtml(path) {
        var options = {
            removeComments: true,//清除HTML注释
            collapseWhitespace: true,//压缩HTML
            collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,//压缩页面JS
            minifyCSS: true//压缩页面CSS
        };
        gulp.src('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/html/*.html')
            .pipe(htmlmin(options))
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/html'))
    }
});

//压缩图片
gulp.task('minifyimage', function () {
    if (options.env == 'test') {
        minifyimage('test');
    }
    else {
        minifyimage('production');
    }
    function minifyimage(path) {
        gulp.src('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/images/*')
            .pipe(imagemin({
                progressive: true
            }))
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/images/'))
    }
});

//copy vendor
gulp.task('copy-vendor', function () {
    if (options.env == 'test') {
        copyvendor('test')
    }
    else {
        copyvendor('production')
    }
    function copyvendor(path) {
        gulp.src(['vendor/**/*.css', 'vendor/**/*.js', 'vendor/**/*.ttf'])
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/vendor'));
    }
});

//添加版本号
gulp.task('clean', function () {
    if (options.env == 'test') {
         del('../../../test/nuoxin_enterprise_app_fe/app_1.3',{force:true})
    }
    else {
         del('../../../production/nuoxin_enterprise_app_fe/app_1.3',{force:true})
    }
});
gulp.task('addversion', function () {
    if (options.env == 'test') {
        addversion('test');
    }
    else {
        addversion('production');
    }
    function addversion(path) {
         gulp.src(['dist/**/*','!dist/less/*.less'])
            .pipe(rev())
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/rev'))
    }
});
gulp.task('rev', function () {
    //html中的引用除了哈希值以外的其他所有文件名都一致才可以匹配替换
    if (options.env == 'test') {
        rev('test');
    }
    else {
        rev('production');
    }
    function rev(path) {
         gulp.src(['../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/dist/rev/**/*.json', './html/*.html'])
            .pipe(revCollector({
                replaceReved: true
            }))
            .pipe(gulp.dest('../../../' + path + '/nuoxin_enterprise_app_fe/app_1.3/html'));
    }
});
//测试环境
//gulp clean --env test   gulp build --env test   gulp rev --env test   gulp simplify --env test
//生产环境
//gulp clean --env production   gulp build --env production   gulp rev --env production   gulp simplify --env production
gulp.task('build',gulpSequence('constants','addversion'));
gulp.task('simplify',['constants','copy-vendor','uglifyjs','mincss','minifyimage','minifyhtml'])
