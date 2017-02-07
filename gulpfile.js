var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');

var tsProject = ts.createProject({
    declaration: true
});

gulp.task('build', function() {
    var appts = gulp.src('src/app.ts')
        .pipe(tsProject());

    var index = gulp.src('src/index/*');

var lib = gulp.src('lib/*');

    return merge([ // Merge the two output streams, so this task is finished when the IO of both operations is done.
        index.pipe(gulp.dest('build/index/')),
        appts.pipe(gulp.dest('build/')),
        lib.pipe(gulp.dest('build/index/'))
    ]);
});

gulp.task('watch', ['build'], function() {
    gulp.watch('src/**/*', ['build']);
});