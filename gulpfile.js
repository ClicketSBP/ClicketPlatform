const gulp = require('gulp'),
    jshint = require('gulp-jshint');

const PATHS = {
    JS: {
        BACKEND: './server/**/*.js'
    }
};

gulp.task('default', () => {
    let jswatcher = gulp.watch([PATHS.JS.BACKEND], ['js']);
});

gulp.task('js', () => {
    gulp.src(PATHS.JS.BACKEND)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }));
});