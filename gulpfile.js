// load the plugins
var gulp      = require('gulp'),
    less      = require('gulp-less'),
    minifyCSS = require('gulp-minify-css'),
    rename    = require('gulp-rename'),
    jshint    = require('gulp-jshint'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    nodemon   = require('gulp-nodemon');

// task for linting js files, type 'gulp js'
gulp.task('js', function() {
return gulp.src(['server.js', 'client/**/*.js', 'client/app.js', 'server/**/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// task to lint, minify, and concat frontend files
gulp.task('scripts', function() {
return gulp.src(['client/**/*.js', 'client/app.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/dist'));
});

// watch the following files for changes and make sure to update
gulp.task('watch', function() {

  // watch js files and run lint and run js and angular tasks
  gulp.watch(['server/**/*.js'], ['js']);
  gulp.watch(['server.js', 'client/**/*.js', 'client/app.js'], ['js', 'scripts']);
});

// use nodemon wtih gulp
gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js less html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

// defining the main gulp task
gulp.task('default', ['nodemon'])
