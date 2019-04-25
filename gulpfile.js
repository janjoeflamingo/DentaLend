const { src, task, dest, watch, series, parallel } = require('gulp');

const clean = require('gulp-clean');
const sass = require('gulp-sass');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const template = require('gulp-template');

const browserSync = require('browser-sync').create();

task('webserver', () => {
  browserSync.init({
    open: true,
    notify: false,
    server: {
      baseDir: 'dist',
    },
    browser: ['google chrome'],
  });

  browserSync.watch('dist/**/*.*').on('change', browserSync.reload)
});

task('clean', () =>
  src('dist/*', {read: false})
    .pipe(clean())
);

task('sass', () =>
  src([
    'src/scss/*.{sass,scss}',
    'src/scss/**/*.{sass,scss}',
    '!src/scss/_*.*',
    '!src/scss/**/_*.*',
  ])
    .pipe(sass())
    .pipe(cssnano())
    .pipe(dest('dist/static/css'))
);

task('js', () =>
  src([
    'src/js/*.js',
    'src/js/**/*.js',
    '!src/js/_*.*',
    '!src/js/**/_*.*',
  ])
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(dest('dist/static/js'))
);

task('img', () =>
  src('src/img/*.*')
    .pipe(dest('dist/img'))
);

task('template', () =>
  src('src/*.html')
    .pipe(template())
    .pipe(dest('dist'))
);

task('watch', () => {
  watch(['src/img/*.*'], series('img'));
  watch(['src/*.html'], series('template'));
  watch(['src/js/*.js', 'src/js/**/*.js'], series('js'));
  watch(['src/scss/*.{sass,scss}', 'src/scss/**/*.{sass,scss}'], series('sass'));
});

task('build', series('clean', parallel('template', 'sass', 'js', 'img')));

task('default', parallel('watch', 'webserver'))
