var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var traceur = require('gulp-traceur');
var karma = require('karma');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
/*
var handle = function(stream) {
    stream.on('error', function() {
        gutil.log.apply(this, arguments);
        stream.end();
    });
    
};
*/
var sources = {
    js: ['site/app.js', 'site/components/**/*.js'],
    scss: ['site/styles/**/*.scss']


};

var destinations = {
    js: 'site/build/js/',
    css: 'site/build/css/'

};

gulp.task('build:js', function(){
    return gulp.src(sources.js)
        .pipe(sourcemaps.init())
       // .pipe(traceur())
       // .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destinations.js));

});

/*
gulp.task('test:js', function(done) {
    return karma.start({
        configFile: __dirname + 'karma.conf.js',
        singleRun: true
    }, done);
}); */


gulp.task('lint:js', function() {
    return gulp.src(sources.js)
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean:js', function() {
    return del(destinations.js + '**/*.js');
});

gulp.task('watch:js',  function() {
    gulp.watch(sources.js, ['make:js']);
});


gulp.task('make:js', ['clean:js', 'lint:js', 'build:js']);

gulp.task('default', ['make:js', 'watch:js']);

