//引入gulp
var gulp = require('gulp');


//引入组件
var imagemin = require('gulp-imagemin'),  //图片压缩

    imageminJpegRecompress = require('imagemin-jpeg-recompress'),  //jpg图片压缩

    tiny = require('gulp-tinypng-nokey'),

    imageminOptipng = require('imagemin-optipng');  //png图片压缩          


//优点：快速
//缺点：此种工具压缩出来size变小不明显
gulp.task('default', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: false,//高精度模式
            quality: "low",//图像质量:low, medium, high and veryhigh;
            method: "ssim",//网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 10,//最低质量
            loops: 0,//循环尝试次数, 默认为6;
            progressive: false,//基线优化
            subsample: "default"//子采样:default, disable;
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 7
        });
    gulp.src(['src/images/**/*'])
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest('dist/images'));
});



//https://tinypng.com/developers
//优点：此种工具压缩出来size变小，质量影响小，
//缺点：耗时长,可能有数量限制
// gulp.task('default', function() {
//     gulp.src('src/images/**/*')
//         .pipe(tiny())
//         .pipe(gulp.dest('dist/images'));
// });

