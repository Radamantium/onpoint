'use strict';

const gulp        = require('gulp');
const gulpIf      = require('gulp-if');
const imagemin    = require('gulp-imagemin');
const postcss     = require('gulp-postcss');
// const url         = require('postcss-url');
const sourcemaps  = require('gulp-sourcemaps');
const del         = require('del');
const browserSync = require('browser-sync').create();
// const flatten     = require('gulp-flatten');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('html', function() {
  return gulp.src('dev/index.html')
    .pipe(gulp.dest('prod'));
});

gulp.task('js', function() {
  return gulp.src('dev/**/*.js')
    .pipe(gulp.dest('prod'));
});

gulp.task('fonts', function() {
  return gulp.src('dev/fonts/*', {since: gulp.lastRun('fonts')})
    .pipe(gulp.dest('prod/fonts'));
});

gulp.task('styles', function() {
  return gulp.src('dev/css/main.css')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-url')({ url: 'rebase' }),
      require('autoprefixer')({}),
      require('cssnano')
    ]))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('prod/css'));
});

gulp.task('images', function() {
  return gulp.src(['dev/img/*', 'dev/modules/**/*.{jpg,png,svg}'], {since: gulp.lastRun('images'), base: 'dev'})
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
      ]))
    // .pipe(flatten())
    .pipe(gulp.dest('prod'));
});

gulp.task('clean', function() {
  return del('prod');
});

gulp.task('build', gulp.series('clean', gulp.parallel('html', 'js', 'styles', 'images', 'fonts')));


gulp.task('watch', function(){
  gulp.watch(['dev/css/**/*', 'dev/modules/**/*.css'], gulp.series('styles'));
  gulp.watch('dev/img/**/*', gulp.series('images'));
  gulp.watch('dev/fonts/**/*', gulp.series('fonts'));  
});

gulp.task('server', function() {
  browserSync.init({
    server: 'prod'
  });
  browserSync.watch('prod/**/*.*')
    .on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'server')));


