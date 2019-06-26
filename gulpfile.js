'use strict'

const gulp    = require('gulp'),
      postcss = require('gulp-postcss');

gulp.task('css', function() {
  return gulp.src('dev/css/main.css')
    .pipe(postcss([
      require('postcss-import'),
      require('autoprefixer')({}),
      require('cssnano')
    ]))
    .pipe(gulp.dest('prod/css'));
});