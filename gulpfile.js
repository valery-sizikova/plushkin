var gulp = require('gulp'),
    electron = require('electron-prebuilt'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    shell = require('gulp-shell'),
    ngAnnotate = require('gulp-ng-annotate');

var paths = {
  js: ['./src/app/**/*.module.js', './src/app/**/*.js'],
  sass: ['./src/app/**/*.scss'],
  html: ['./src/app/**/*.html', './src/index.html']
};

gulp.task('default', ['js', 'sass', 'html']);

gulp.task('run', ['electron', 'default', 'watch']);

gulp.task('electron', shell.task(['electron src']));

/**
 *  Watch task
 */
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.js, ['js']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.sass, ['sass']);
});

/**
 *  JS task - injects files into src.js
 */
gulp.task('js', function(done) {
  gulp.src(['./src/app/app.module.js', './src/app/app.route.js', './src/app/**/*.module.js', './src/app/**/*.js'])
    .pipe(concat('app.js'))
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('./src/assets/js'))
    .pipe(livereload())
    .on('end', done);
});

/**
 *  SASS task - injects files into src.scss and updates the assets/css directory accordingly
 */
gulp.task('sass', function(done) {

  var files = gulp.src([
    './src/app/**/*.scss',
    '!.src/app/_sass-utilities/*.scss',
    '!./src/app/src.scss'
  ]);
  var injectOptions = {
    transform: function(filePath) {
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  gulp.src('./src/app/app.scss')
    .pipe(inject(files, injectOptions))
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(livereload())
    .on('end', done);
});

/**
 * HTML task - listens to changes in html files and gives a signal to live reload
 */
gulp.task('html', function(done) {
  gulp.src('./src/app/**/*.html')
    .pipe(livereload())
    .on('end', done);
});
