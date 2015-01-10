var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var wiredep = require('wiredep').stream;
var inject = require("gulp-inject");

function swallowError(error)
{
  console.log(error.toString());
  this.emit('end');
}

// config vars
var base = './www';
var mainFile = base + '/index.html';
var p = {
  sass: ['./scss/**/*.scss'],
  bowerTargets: [mainFile],
  appJs: base + '/js/**/*.js'
};


gulp.task('default', [
  'bower',
  'inject',
  'watch'
]);


gulp.task('sass', function (done)
{
  gulp.src('./scss/styles.scss')
    .pipe(sass())
    .on('error', swallowError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});


gulp.task('watch', function ()
{
  gulp.watch(p.sass, ['sass']);
  gulp.watch(p.appJs, ['inject']);

});


gulp.task('bower', function ()
{
  gulp.src(p.bowerTargets, {base: './'})
    .pipe(wiredep({
      devDependencies: true,
      exclude: [
        // is included in ionic
        //'angular'
      ]
    }))
    .pipe(gulp.dest('./'));
});


gulp.task('inject', function ()
{
  var sources = gulp.src([p.appJs], {read: false});
  gulp.src(mainFile)
    .pipe(inject(sources,
      {
        ignorePath: 'www',
        addRootSlash: false
      }
    ))
    .pipe(gulp.dest(base));
});
