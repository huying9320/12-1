var gulp = require('gulp');
// 编译scss
var sass = require('gulp-sass');
// 添加兼容
var autoprefixer = require('gulp-autoprefixer');
// 压缩css文件
var mincss = require('gulp-clean-css');
// 合并文件
var concat = require('gulp-concat');

// 压缩js
var uglify = require('gulp-uglify');

// 起服务
var server = require('gulp-webserver');
var url = require('url');
var path = require('path');
var fs = require('fs');
var data = require('./mock/data.json');

// es6--->es5 语法
// var babel = require('gulp-babel');

// 生成css文件
gulp.task('default', function() {
    // 读取文件
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
})

// 编译scss
gulp.task('Scss', function() {
    // 读取文件
    return gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(concat('all.css'))
        .pipe(mincss())
        .pipe(gulp.dest('./css'))
})

// 监听scss
gulp.task('devWatch', function() {
    return gulp.watch('./scss/*.scss', gulp.series('Scss'))
})

// 启动服务
gulp.task('server', function() {
    return gulp.src('../build')
        .pipe(server({
            port: 8060, //配置端口
            open: true, //自动打开浏览器
            // livereload: true, //自动刷新浏览器
            // host: '169.254.20.49', //配置ip
            // fallback: 'index.html', //指定默认文件
            middleware: function(req, res, next) { // 拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (req.url === '/favicon.ico' || req.url === '/js/lib/swiper.min.js.map') {
                    return res.end('');
                }
                if (pathname === '/api/data') {
                    res.end(JSON.stringify({ code: 0, msg: '加载成功', result: data }))
                } else {
                    // 加载首页
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    console.log(pathname);
                    res.end(fs.readFileSync(path.join(__dirname, '../build', pathname)));
                }
            }
        }))
})

// 开发环境
gulp.task('dev', gulp.parallel('Scss', 'server', 'devWatch'));



// 整到线上环境build

gulp.task('bcss', function() {
    return gulp.src('./css/*.css')
        .pipe(gulp.dest('../build/css'))
})

// 压缩js
gulp.task('buglify', function() {
    return gulp.src(['./js/*.js', '!./js/lib/*.js'])
        // .pipe(babel({
        //     presets: ['@babel/env']
        // }))
        // .pipe(uglify())
        .pipe(gulp.dest('../build/js'))
})

// 项目引入的拷贝js
gulp.task('bcopyjs', function() {
    return gulp.src('./js/lib/*.js')
        .pipe(gulp.dest('../build/js/lib'))
})

// 压缩html
gulp.task('bhtml', function() {
    return gulp.src('./*.html')
        .pipe(gulp.dest('../build'))
})

// Image
gulp.task('bimg', function() {
    return gulp.src('./img/*.jpg')
        .pipe(gulp.dest('../build/img'))
})

gulp.task('bfonts', function() {
    return gulp.src('./fonts/*.*')
        .pipe(gulp.dest('../build/fonts'))
})

// 线上环境
gulp.task('bdev', gulp.series('bcss', 'bimg', 'buglify', 'bfonts', 'bcopyjs', 'bhtml'));