var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var filter = require('gulp-filter');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var map = require('map-stream'); //Install it on your own :)

// js
var jsbeautify = require('gulp-beautify');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

// html
var htmlbeautify = require('gulp-prettify');
var htmlhint = require('gulp-w3cjs');

// css
var cssbeautify = require('gulp-cssbeautify');
var csshint = require('gulp-csslint');

// sass/scss
var compass = require('gulp-compass');

// coffee
var coffee = require('gulp-coffee');


// test
var htmlbuild = require('gulp-htmlbuild'); // 字串寫入
var es = require('event-stream');
var tap = require('gulp-tap'); // 取得檔案名稱
var rename = require("gulp-rename");
var path = require('path');
var fs = require('fs');

var symlink = require('gulp-symlink'); //Again don't forget to install it


var filefolder = {
    'js': 'js/**/*.js',
    'html': 'html/**/*.html',
    'css': 'css/**/*.css',
    'sass': 'sass/**/*.{sass, scss}',
    'coffee': 'coffee/**/*.coffee',
    'test': {
        'html': {
            'html': 'test/html/*.html',
            'script': 'test/html/script/*.js'
        },
        'js': {
            'html': 'test/js/*.html',
            'script': 'test/js/script/**/*.js'
        }
    }
};

var errorReporter = function () {
    return map(function (file, cb) {

        if (!file.jshint.success) {
            process.exit(1);
        }
        cb(null, file);
    });
};

var watchStatus = {
    'isAdded': function(file) {
        return file.event === 'added';
    },
    'isChanged': function(file) {
        return file.event == 'changed';
    },
    'isDeleted': function(file) {
        return file.event == 'deleted';
    },
    'isNotDeleted': function(file) {
        return file.event != 'deleted';
    }
};

gulp.task('js-beautify', function() {
    gulp.src(filefolder.js)
        .pipe(watch({
            'emit': 'one',
            'glob': filefolder.js
        }))
        .pipe(filter(watchStatus.isNotDeleted))
        .pipe(jsbeautify({
            indentSize: 4
        }))
        .pipe(gulp.dest('js'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js-hint', function() {
    return gulp.src(filefolder.js)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(errorReporter());
});

gulp.task('hook', function () {
  return gulp.src('.pre-commit')
    .pipe(symlink('.git/hooks/pre-commit'));
  
  //.pipe(symlink('build/videos')) // Write to the destination folder
  //  .pipe(symlink('build/videos/renamed-video.mp4')) // Write a renamed symlink to the destination folder
  /*
    return gulp.src('.pre-commit')
        .pipe(gulp.dest('.git/hooks/pre-commit'));
  */
});


gulp.task('css-beautify', function() {
    return gulp.src(filefolder.css)
        .pipe(watch({
            'emit': 'one',
            'glob': filefolder.css
        }))
        .pipe(filter(watchStatus.isNotDeleted))
        .pipe(cssbeautify())
        .pipe(gulp.dest('css'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('css-hint', function() {
    gulp.src(filefolder.css)
        .pipe(watch({
            'emit': 'one',
            'glob': filefolder.css
        }))
        .pipe(filter(watchStatus.isNotDeleted))
        .pipe(csshint())
        .pipe(csshint.reporter());
});



/*
gulp.task('js', ['js-beautify', 'js-hint']);
gulp.task('html', ['html-beautify', 'html-hint']);
gulp.task('css', ['css-beautify', 'css-hint']);
gulp.task('sass', ['compass']);
gulp.task('default', ['js', 'html', 'css', 'sass', 'coffee']);
gulp.task('livereload', ['browser-sync', 'default']);
gulp.task('test', ['browser-sync', 'test-js', 'test-html', 'default']);
*/