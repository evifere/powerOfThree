var gulp = require('gulp');

// Import dependencies
var jshint  = require('gulp-jshint'),
    uglify  = require('gulp-uglify'),
    concat  = require('gulp-concat'),
    connect = require('gulp-connect'),
    path    = require('path');

// Define tasks

// Lint Task
gulp.task('lint', function () {  
    gulp.src(source + 'js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compress task
gulp.task('compress', function() {
  gulp.src('lib/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});

// concat vendor libs
gulp.task('scripts', function() {
  gulp.src(['node_modules/jquery/dist/jquery.min.js','node_modules/underscore/underscore-min.js','node_modules/backbone/backbone-min.js','node_modules/three/three.min.js'])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/'))
});


// concat app
gulp.task('app', function() {
  gulp.src(['dev/js/core/*.js','dev/js/models/*.js','dev/js/views/*.js','dev/js/PoT.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./dist/'))
});


// concat app
gulp.task('index', function() {
  gulp.src(['dev/index.html'])
    .pipe(concat('index.html'))
    .pipe(gulp.dest('./dist/'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['app','scripts','index']);

//start a local webserver
gulp.task('connect', function() {
  connect.server({
    root: ['dist'],
    port: 1337,
    livereload: true
  });
});