var gulp = require('gulp');
var cmdPack = require('gulp-cmd-pack');
var uglify = require('gulp-uglify');
 
gulp.task('default', function () {
    gulp.src('js/c.js') //main文件 
        .pipe(cmdPack({
            mainId: 'dist/c', //初始化模块的id 
            base: 'js/', //base路径
        }))
        //.pipe(uglify())
        .pipe(gulp.dest('js/dist/'));//输出到目录 
});