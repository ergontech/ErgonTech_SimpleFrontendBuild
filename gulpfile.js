'use strict'

/*
 * Usage Instructions
 *
 * Passing the --production flag to a task will minify the files.
 */

const gulp         = require('gulp'),
    autoprefixer   = require('gulp-autoprefixer'),
    gutil          = require('gulp-util'),
    watch          = require('gulp-watch'),
    sass           = require('gulp-sass'),
    rename         = require('gulp-rename'),
    uglify         = require('gulp-uglify'),
    sourcemaps     = require('gulp-sourcemaps'),
    concat         = require('gulp-concat'),
    pump           = require('pump'),
    browserSync    = require('browser-sync').create();

const config = {

    production: !!gutil.env.production,

    projectUrl: 'http://dev.worn.drmartens.com/',

    projectTheme: './web/app/themes/dm-worn-child/',

    themePaths: {},
    sourcePaths: {},

    init: function() {
        config.themePaths = {
            css: config.projectTheme + 'css',
            js: config.projectTheme + 'js'
        };

        config.sourcePaths = {
            sass: config.projectTheme+ 'source/scss/**/*.scss',
            js: config.projectTheme + 'source/js/**/*.js'
        };

        // No more changes after the init
        Object.freeze(this);

    }.bind(this)
};

config.init();


gulp.task('default', ['compileSass', 'compileJs']);


gulp.task('compileSass', function() {
    return gulp.src(config.sourcePaths.sass)
        .pipe(config.production ? gutil.noop() : sourcemaps.init())
        .pipe(sass({
            outputStyle: config.production ? 'compressed' : 'nested'
        }).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(config.production ? gutil.noop() : sourcemaps.write())
        .pipe(gulp.dest(config.themePaths.css))
        .pipe(browserSync.stream())
});

gulp.task('compileJs', function(cb) {

    pump([
            gulp.src(config.sourcePaths.js),
            config.production ? gutil.noop() : sourcemaps.init(),
            uglify({
                mangle: config.production,
                compress: config.production ? {} : false,
                preserveComments: config.production ? 'license' : 'all',
                output: config.production ? {} : {
                        beautify: true,
                        bracketize: true
                    }
            }),
            config.production ? gutil.noop() : sourcemaps.write(),
            gulp.dest(config.themePaths.js)
        ], cb
    )
});

// create a task that ensures the `compileJs` task is complete before
// reloading browsers
gulp.task('js-watch', ['compileJs'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('watch', function() {
    gutil.log('starting to watch: ' + config.projectTheme);

    browserSync.init({
        proxy: config.projectUrl
    });

    gulp.watch(config.sourcePaths.js, ['js-watch']);
    gulp.watch(config.sourcePaths.sass, ['compileSass']);
});