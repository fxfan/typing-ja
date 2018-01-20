gulp = require 'gulp'
babel = require 'gulp-babel'
uglify = require 'gulp-uglify'

gulp.task 'build', (done)->
  gulp.src 'src/typing-jp.js'
    .pipe babel({presets:['env']})
    .pipe uglify()
    .pipe gulp.dest('.')
