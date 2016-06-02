var gulp = require('gulp');
var gutil = require('gulp-util');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var webpack = require('dj-webpack-stream');
var fs = require('fs-extra');
var htmlify = require('./color');
var jade = require('gulp-jade');


var reload = browserSync.reload;

gulp.task('webpack', () => {
    var flag = true;
    return gulp.src('src/App.js')
        .pipe(webpack(require('./webpack.config.js')))
        .on('error', function (err) {
			flag = false;
            this.emit('end');
            if (err.length) {
                console.log(err.reduce((msg, e) => msg + e.toString(), ''));
                browserSync.notify(err.map( e => htmlify(e)), 60 * 60 * 1000);    
            } else {
                console.log(err);
                browserSync.notify(err, 60 * 60 * 1000);    
            }
            //notify.onError()(err)
        })
        .pipe(gulp.dest('./dist'))
        .on('end', () => {
            console.log(flag);
            if (flag) {
                reload();
            }
        })
});

gulp.task('pre-webpack', done => {
    require('webpack')(require('./webpack.pre.config.js'), err => {
        if (err) throw err;
        done();
    });
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: './dist',
        },
        port: 8080
    });
});

gulp.task('build', ['webpack']);

gulp.task('post-install', ['pre-webpack'], () => {
    fs.mkdirpSync('./dist');
    fs.copySync('./node_modules/babel-polyfill/dist/polyfill.min.js', './dist/polyfill.min.js');
    //fs.copySync('./node_modules/antd/lib/index.css', './dist/antd.css');
    var json = JSON.parse(fs.readFileSync('./dist/vendor-manifest.json').toString());
    return gulp.src('index.jade')
        .pipe(jade({
            locals: {
               vendor: json.name 
            },
            pretty: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', () => {
    gulp.start('browserSync', 'webpack');
    gulp.watch(['src/**/*.scss',
            'src/components/**/*.scss',
            'src/**/*.js',
            'src/components/**/*.js'], ['webpack']).on('error', notify.onError());
});
