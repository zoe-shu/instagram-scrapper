var gulp = require('gulp'),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    cssnano = require('gulp-cssnano'),
    minifyCSS = require('gulp-minify-css'),
    map = require('map-stream');

var publicFolder = 'public/',
    sourceFolder = 'src/',
    imageDest = publicFolder + 'img/',
    cssSources = [
      sourceFolder + "css/plugins/*.css",
      sourceFolder + "css/plugins/*.less",
      sourceFolder + "css/plugins/*.min.less",
      sourceFolder + "css/plugins/*.min.css",
      sourceFolder + "css/main.less",
    ],
    cssDest = publicFolder + 'css/',
    cssDestFile = 'style.min.css',
    jsSources = sourceFolder + 'js/**/*.js',
    jsDest = publicFolder + 'js/',
    jsDestFile = 'script.min.js',
    jsImports = [
        sourceFolder + "js/jquery-3.2.1.min.js",
        sourceFolder + "js/plugins/*.js",
        sourceFolder + "js/plugins/*.min.js",
        sourceFolder + "js/pages/*.js",
        sourceFolder + "js/main.js",
    ];

// Styles
gulp.task('action-css-minify', function() {
    return gulp.src(cssSources)
        //.pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(concat(cssDestFile))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        //.pipe(sourcemaps.write('maps'))
        .pipe(minifyCSS({})) //keepBreaks: true }))
        .pipe(gulp.dest(cssDest));
});

// Scripts
gulp.task('action-js-minify', function() {
    return gulp.src(jsImports)
        //.pipe(sourcemaps.init())
        //.pipe(jshint())
        //.pipe(myReporter)
        .pipe(concat(jsDestFile))
        .pipe(uglify())
        //.pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(jsDest));
});

// Images
gulp.task('action-images-minify', function() {
    return gulp.src(imageDest + '**/*.{jpg,png}')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(imageDest + 'images-final'));
});

// Watch
gulp.task('watch', function() {
    // Watch .less files
    gulp.watch(cssSources, ['action-css-minify']);

    // Watch .js files
    gulp.watch(jsSources, ['action-js-minify']);

    // Watch image files
    //gulp.watch('images/**/*.{jpg,png}', ['action-images-minify']);                    //Enable this when needed

});

// const myReporter = map(function(file, cb) {
//     if (file.jshint.success) {
//         return cb(null, file);
//     }

//     console.log('JSHINT fail in', file.path);
//     file.jshint.results.forEach(function(result) {
//         if (!result.error) {
//             return;
//         }

//         const err = result.error
//         console.log(`  line ${err.line}, col ${err.character}, code ${err.code}, ${err.reason}`);
//     });

//     cb(null, file);
// });

// Default task
gulp.task('default', [
    'action-css-minify',
    'action-js-minify',
    //'action-images-minify',                    //Enable this when needed
    'watch'
]);
