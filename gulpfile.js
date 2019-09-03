'use strict';

const gulp          = require('gulp');
const gulpIf        = require('gulp-if');
const imagemin      = require('gulp-imagemin');
const postcss       = require('gulp-postcss');
const sourcemaps    = require('gulp-sourcemaps');
const del           = require('del');
const browserSync   = require('browser-sync').create();
const webpack       = require('webpack-stream');

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

gulp.task('assets:html', function() {
  return gulp.src('./dev/index.html', {since: gulp.lastRun('assets:html')})
    .pipe(gulp.dest('./prod'));
});

gulp.task('assets:fonts', function() {
  return gulp.src('./dev/fonts/*', {since: gulp.lastRun('assets:fonts')})
    .pipe(gulp.dest('./prod/fonts'));
});

gulp.task('assets:images', function() {
  return gulp.src(['./dev/img/*', './dev/modules/**/*.{jpg,png,svg}'], {since: gulp.lastRun('assets:images'), base: 'dev'})
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true})
      ]))
    .pipe(gulp.dest('./prod'));
});

gulp.task('assets', gulp.parallel('assets:html', 'assets:fonts', 'assets:images'));

let webpackConfig = {
  output: {
    filename: 'js/main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  },
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-source-map' : 'none'
}

gulp.task('scripts', function() {
  return gulp.src('./dev/js/main.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./prod'));
});

gulp.task('styles', function() {
  return gulp.src('./dev/css/main.css')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-url')({ url: 'rebase' }),
      require('autoprefixer')({}),
      require('cssnano')
    ]))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulp.dest('./prod/css'));
});

gulp.task('clean', function() {
  return del('./prod');
});

gulp.task('build', 
  gulp.series(
    'clean', 
    gulp.parallel('assets', 'scripts', 'styles')
  )
);

gulp.task('watch', function(){
  gulp.watch('dev/index.html', gulp.series('assets:html'));
  gulp.watch('dev/fonts/**/*', gulp.series('assets:fonts')); 
  gulp.watch(['dev/img/**/*', 'dev/modules/**/*.{jpg,png,svg}'],  gulp.series('assets:images'));
  gulp.watch(['dev/js/**/*',  'dev/modules/**/*.js'],  gulp.series('styles')); 
  gulp.watch(['dev/css/**/*', 'dev/modules/**/*.css'], gulp.series('scripts'));
});

gulp.task('server', function() {
  browserSync.init({
    server: 'prod'
  });
  browserSync.watch('prod/**/*.*')
    .on('change', browserSync.reload);
});

gulp.task('dev', 
  gulp.series(
    'build', 
    gulp.parallel('watch', 'server')
  )
);


