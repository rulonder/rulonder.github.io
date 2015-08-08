var gulp = require('gulp');
var markdown = require('gulp-markdown');
var swig = require('gulp-swig');
var data = require('gulp-data');
var tap = require('gulp-tap');
var fm = require('front-matter');
var gutil = require('gulp-util');
var imageResize = require('gulp-image-resize')({ imageMagick: true });

var memory = [];

gulp.task('default', function () {
    return gulp.src('posts/**/*.md')
        .pipe(data(function(file) {
          var content = fm(String(file.contents));
          file.contents = new Buffer(content.body);
          return content.attributes;
        }))
        .pipe(swig())
        .pipe(markdown())
        .pipe(gulp.dest('dist'));
});

gulp.task('load_data', function () {
  // body...
  return gulp.src('posts/**/*.md')
  .pipe( tap(function(file) {
    // save the file contents in the assets
    var content = fm(String(file.contents));
    memory.push(content.attributes);
  }))
  .on('end', function(){
    gutil.log('Almost there...');
    gutil.log(memory);
})
})

gulp.task('parse_index',["load_data"], function() {
  gulp.src('posts/index.html')
    .pipe(swig({data:{items:memory, name:"index"}}))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('index', ['load_data', 'parse_index']);

/*
  Get data via front matter
*/
gulp.task('fm-test', function() {
  return gulp.src('posts/**/*.md')
    .pipe(data(function(file) {
      var content = fm(String(file.contents));
      file.contents = new Buffer(content.body);
      return content.attributes;
    }))
    .pipe(swig())
    .pipe(gulp.dest('build'));
});

gulp.task('resize', function () {
  gulp.src('posts/**/*.{jpg,png}')
  .pipe(imageResize({ width:500, height : 300 }))
  .pipe(gulp.dest('dist'));
});
