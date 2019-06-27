var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("npat", function () {
    return browserify({  
        basedir: '.',
        debug: true,
        entries: ['src/Npat/main.ts'], // mainTask
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('npat.js')) // tasks
    .pipe(gulp.dest("dist"));
});

gulp.task("testDetection", function () {
    return browserify({  
        basedir: '.',
        debug: true,
        entries: ['src/testDetection/main.ts'], // mainTask
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('testDetection.js')) // tasks
    .pipe(gulp.dest("dist"));
});

gulp.task("default", gulp.series(gulp.parallel('testDetection', 'npat'), function () {
    return browserify({  
        basedir: '.',
        debug: true,
        entries: ['src/taco/main.ts'], // mainTask
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('taco.js')) // tasks
    .pipe(gulp.dest("dist"));
}));