const { src, dest } = require('gulp');
const babel = require('gulp-babel');
const uglify = require("gulp-uglify");

exports.default = function() {
    return src('assets/js/*.js')
    .pipe(babel())
    .pipe(src('vendor/*.js'))
    .pipe(uglify())
    .pipe(dest('dist/'));
}