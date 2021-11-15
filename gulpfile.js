let source_folder = '#src';
let project_folder = 'dist';

const gulp = require('gulp');
const {
    series,
    parallel
} = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const rename = require("gulp-rename");
// const babel = require('gulp-babel');
// const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const del = require('del');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

const html = () => {
    return gulp.src('#src/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('dist'))
}

const styles = () => {
    return gulp.src('#src/styles/*.scss')
        .pipe(sass().on('err', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('dist/css'))
        .pipe(cssnano())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist/css'))
}

const fonts = () => {
    gulp.src('#src/fonts/**/*.ttf')
        .pipe(ttf2woff())
        .pipe(gulp.dest('dist/fonts'))
    return gulp.src('#src/fonts/**/*.ttf')
        .pipe(ttf2woff2())
        .pipe(gulp.dest('dist/fonts'))
}

// const scripts = () => {
//     return gulp.src('src/scripts/*.js')
//         .pipe(babel({
//             presets: ['@babel/env']
//         }))
//         .pipe(uglify())
//         .pipe(concat('main.min.js'))
//         .pipe(gulp.dest('build/js'))
// }

const images = () => {
    return gulp.src('#src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
}

const server = () => {
    browserSync.init({
        server: {
            baseDir: './dist'
        },
        notify: false
    });
    browserSync.watch('dist', browserSync.reload)
}

const deleteDist = (cb) => {
    return del('dist/**/*.*').then(() => {
        cb()
    })
}

const watch = () => {
    gulp.watch('#src/pug/**/*.pug', html);
    gulp.watch('#src/styles/**/*.scss', styles);
    // gulp.watch('src/scripts/**/*.js', scripts);
    gulp.watch('#src/images/*.*', images);
    gulp.watch('#src/fonts/*.ttf', fonts);
}

exports.default = series(
    deleteDist,
    parallel(html, styles, fonts, images),
    parallel(watch, server)
)