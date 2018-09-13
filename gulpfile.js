var gulp = require('gulp');

var server = require('gulp-webserver');

var url = require('url');

var fs = require('fs');

var path = require('path');

var mock = require('./mock');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var concat = require('gulp-concat');

gulp.task('devServer', function() {
    return gulp.src('src')
        .pipe(server({
            port: 9090,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('');
                    return
                }

                if (/^\/api/.test(pathname)) {

                    res.end(JSON.stringify({ code: 1, data: mock(pathname) }))
                } else {
                    pathname = /\.js|\.css|\.html|\.jpg|\.png$/.test(pathname) ? pathname : '/index.html';
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))
})

//开发环境编译sass
gulp.task('devCss', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android>=4.0']
        }))
        .pipe(concat('all.css'))
        .pipe(gulp.dest('./src/css'))
})

//监听

gulp.task('watch', function() {
    return gulp.watch('./src/sass/*.scss', gulp.series('devCss'))
})

//开发环境
gulp.task('dev', gulp.series('devCss', 'devServer', 'watch'));