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



// 生成css文件
gulp.task('default', function() {
    // 读取文件
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

// 编译scss
gulp.task('Scss', function() {
    // 读取文件
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(concat('all.css'))
        .pipe(mincss())
        .pipe(gulp.dest('./src/css'))
})

// 监听scss
gulp.task('devWatch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('Scss'))
})

// 启动服务
gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8060, //配置端口
            // open: true, //自动打开浏览器
            // livereload: true, //自动刷新浏览器
            // host: '169.254.20.49', //配置ip
            // fallback: 'index.html', //指定默认文件
            middleware: function(req, res, next) { // 拦截前端请求
                var pathname = url.parse(req.url).pathname;
                if (pathname === '/data') {
                    console.log(123)
                    res.end(JSON.stringify({ code: 0, msg: '加载成功', result: data }))
                } else {
                    // 加载首页
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    console.log(pathname);
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)));
                }
            }
        }))
})

// 开发环境
gulp.task('dev', gulp.parallel('Scss', 'server', 'devWatch'));



// 线上环境
// 压缩js
gulp.task('buglify', function() {
    return gulp.src(['./src/js/**/*.js', '!./src/js/libs/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})