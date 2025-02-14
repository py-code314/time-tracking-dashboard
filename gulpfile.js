const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

function styles() {
  // Source sass files
  return (
    gulp
      .src('sass/**/*.scss')
      // Sass compiler
      .pipe(sass().on('error', sass.logError))
      // Destination css files
      .pipe(gulp.dest('css'))
      // Stream changes to all browsers
      .pipe(browserSync.stream())
  );
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  gulp.watch('sass/**/*.scss', styles);
  gulp.watch('*.html').on('change', browserSync.reload);
  gulp.watch('js/**/*.js').on('change', browserSync.reload);
}

// build function for Netlify
function build(cb) {
  gulp.series(styles)(cb);
}

exports.styles = styles;
exports.watch = watch;
exports.build = build;
