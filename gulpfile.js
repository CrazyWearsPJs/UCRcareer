var gulp = require('gulp');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');
var uglify = require('gulp-uglify');
var karma = require('karma').server;

var sources = {
    js: ['site/app.js', 'site/components/**/*.js'],
    scss: ['site/styles/**/*.scss']

};

var destinations = {
    js: 'site/build/js/',
    css: 'site/build/css/'

};

gulp.task('build:js', function(){
    gulp.src(sources.js)
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(destinations.js));
});

