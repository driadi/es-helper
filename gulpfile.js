'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  runSequence = require('run-sequence'),
  pkg = require('./package.json');

gulp.task('jshint', function () {
  return gulp.src(['./src/**/*.js', './test/specs/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('build', function () {
  var destDir = './dist/';

  function browserifyOutput() {
    var b = browserify(pkg.main)
      .bundle()
      .pipe(source('es-helper.js'))
      .pipe(buffer());

    b.pipe(gulp.dest(destDir));
  }

  return browserifyOutput();
});

gulp.task('default', function() {
  runSequence('jshint', 'build');
});