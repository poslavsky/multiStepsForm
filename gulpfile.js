const gulp = require('gulp');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');
const gulpIf = require('gulp-if');
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);
const concat = require('gulp-concat');
const del = require('del');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const path = require('path');
var replace = require('gulp-replace');
// При разработке запускаю проект командой gulp dev
const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';
// При вызове NODE_ENV=ghpages gulp dev при сборке, 
// пути изображений заменяться на нужные для Github pages
// после этого пушим проект в ветку gh-pages
// затем переключаем на мастер и там собираем через gulp dev и пушим с норм путями
const isGHPages = process.env.NODE_ENV == 'ghpages';

// Start browserSync server
gulp.task('serve', function() {
  browserSync.init({
    server: 'public'
  });
  browserSync.watch('public/**/*.*').on('change', browserSync.reload);
})

gulp.task('styles', function() {
  return gulp.src('src/less/common.less')
    .pipe(gulpIf(isDevelopment, sourcemaps.init()))
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulpIf(isDevelopment, sourcemaps.write()))
    .pipe(gulpIf(isGHPages, replace('/img', '/multiStepsForm/public/img')))
    .pipe(gulp.dest('public/css'));
});

gulp.task('clean', function() {
  return del('public');
});

gulp.task('assets', function() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest('public'));
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
          plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
          ]
      })
    ]))
    .pipe(gulp.dest('public/img'));
});

gulp.task('js', function () {
  return gulp.src('src/js/*.js')
  .pipe(concat('all.js'))
  // .pipe(uglify())
  .pipe(gulp.dest('public/js'))
});

gulp.task('build', gulp.series (
  'clean',
  gulp.parallel('styles', 'assets', 'fonts', 'images', 'js'))
);

// Watchers
gulp.task('watch', function() {
  gulp.watch('src/less/*.less', gulp.series('styles'));
  gulp.watch('src/js/*.js', gulp.series('js'));
  gulp.watch(['src/*.html','src/img'], gulp.series('assets'));
})

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));
