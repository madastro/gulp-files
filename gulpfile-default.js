// NOTE: Please be sure to rename this file to 'gulpfile.js' before use!

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const webserver = require('gulp-webserver');
const inject = require('gulp-inject');
const cleanHTML = require('gulp-htmlclean');
const cleanCSS = require('gulp-clean-css');
const del = require('del');

/* ============================================================================
    FILE PATHS
============================================================================ */

let paths = {

    // Source Files
    src: 'app/**/*',
    srcHTML: 'app/**/*.html',
    srcCSS: 'app/**/*.scss',
    srcJS: 'app/**/*.js',
    srcIMG: 'app/**/*.+(png|jpg|jpeg|gif|svg)',

    // Development Files
    tmp: 'tmp',
    tmpIndex: 'tmp/index.html',
    tmpCSS: 'tmp/**/*.css',
    tmpJS: 'tmp/**/*.js',
    tmpIMG: 'tmp/**/*.+(png|jpg|jpeg|gif|svg)',

    // Production Files
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: 'dist/**/*.css',
    distJS: 'dist/**/*.js',
    distIMG: 'dist/**/*.+(png|jpg|jpeg|gif|svg)',

}

/* ============================================================================
    MESSAGE
============================================================================ */

gulp.task('message', function(){
    return console.log('Gulp is running...'); // Prints out the message 'Gulp is running...'
});

/* ============================================================================
    HTML
============================================================================ */

gulp.task('html', function(){
    return gulp.src(paths.srcHTML) // Checks 'app/**/*' for files ending in .html
        .pipe(gulp.dest(paths.tmp)); // Places .html files in 'tmp/'
});

gulp.task('html:dist', function(){
    return gulp.src(paths.tmpHTML) // Checks 'tmp/**/*' for files ending in .html
        .pipe(cleanHTML()) // Cleans the HTML, removing comments
        .pipe(gulp.dest(paths.dist)); // Places .html files in 'dist/'
});

/* ============================================================================
    STYLES
============================================================================ */

gulp.task('sass', function(){
    return gulp.src(paths.srcCSS) // Checks 'app/**/*' for files ending in .scss
        .pipe(sass().on('error', sass.logError)) // Compiles Sass files into CSS; Logs Error Message in Terminal
        .pipe(gulp.dest(paths.tmp)); // Places compiled CSS files in 'temp/'
});

gulp.task('css:dist', function(){
    return gulp.src(paths.tmpCSS) // Checks 'tmp/**/*' for files ending in .css
        .pipe(cleanCSS()) // Cleans the CSS, removing comments
        .pipe(concat('style.min.css')) // Concatenates .css files into style.min.css
        .pipe(gulp.dest(paths.dist)); // Places style.min.css in 'dist/'
});

/* ============================================================================
    JAVASCRIPT
============================================================================ */

gulp.task('js', function(){
    return gulp.src(paths.srcJS) // Checks 'app/**/*' for files ending in .js
        .pipe(gulp.dest(paths.tmp)); // Places .js files in 'tmp/'
});

gulp.task('js:dist', function(){
    return gulp.src(paths.tmpJS) // Checks 'tmp/**/*' for files ending in .js
        .pipe(concat('script.min.js')) // Concatenates .js files into script.min.js
        .pipe(uglify()) // Uglifies script.min.js
        .pipe(gulp.dest(paths.dist)); // Places script.min.js is 'dist/'
})

/* ============================================================================
    IMAGES
============================================================================ */

gulp.task('img', function(){
    return gulp.src(paths.srcIMG) // Checks 'app/**/*' for image files
        .pipe(imagemin()) // Compresses images
        .pipe(gulp.dest(paths.tmp)) // Places images in 'tmp/'
});

gulp.task('img:dist', function(){
    return gulp.src(paths.tmpIMG) // Checks 'tmp/**/*' for image files
        .pipe(gulp.dest(paths.dist)); // Places image files in 'dist/'
});

/* ============================================================================
    COPY FILES
============================================================================ */

gulp.task('copy', ['html','sass','js','img']); // Copies html, sass, js, and img files from 'app' to 'tmp'
gulp.task('copy:dist', ['html:dist','css:dist','js:dist','img:dist']); // Copies html, css, js, and img files from 'tmp' to 'dist'

/* ============================================================================
    INJECT FILES
============================================================================ */

gulp.task('inject', ['copy'], function(){
    let css = gulp.src(paths.tmpCSS);
    let js = gulp.src(paths.tmpJS);
    return gulp.src(paths.tmpIndex) 
        .pipe(inject(css,{
            relative: true
        }))
        .pipe(inject(js,{
            relative: true
        }))
        .pipe(gulp.dest(paths.tmp));
});

gulp.task('inject:dist', ['copy:dist'], function(){
    let css = gulp.src(paths.distCSS);
    let js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css,{
            relative: true
        }))
        .pipe(inject(js,{
            relative: true
        }))
        .pipe(gulp.dest(paths.dist));
});

/* ============================================================================
    WEB SERVER
============================================================================ */

gulp.task('serve', ['inject'], function(){
    return gulp.src(paths.tmp)
    .pipe(webserver({
        port: 8080,
        livereload: true
    }));
});

/* ============================================================================
    WATCH FOR CHANGES
============================================================================ */

gulp.task('watch', ['serve'], function(){
    gulp.watch(paths.src, ['inject']);
});

/* ============================================================================
    RUN GULP
============================================================================ */

gulp.task('default', ['message','watch']); // Runs 'message' tasks, then runs 'watch' task

/* ============================================================================
    BUILD
============================================================================ */

gulp.task('build', ['message','inject:dist']); // Builds the 'dist' folder

/* ============================================================================
    CLEAN
============================================================================ */

gulp.task('clean', function(){
    del([paths.tmp, paths.dist]); // Cleans the project; removes 'tmp' and 'dist' folders
});