gulp = require 'gulp'
babel = require 'gulp-babel'
uglify = require 'gulp-uglify'

browserify = require 'browserify'
babelify = require 'babelify'
source = require 'vinyl-source-stream'

notify = require 'gulp-notify'


gulp.task 'build', (done)->
  gulp.src 'src/typing-ja.js'
    .pipe babel({presets:['env']})
    .pipe uglify()
    .pipe gulp.dest('.')

gulp.task 'build-example', (done)->
  browserify 'example/src/simple-typing.js'
    .transform 'babelify', { presets: ['env'] }
    .bundle()
    .on 'error', ->
      notify.onError
        title: 'Example script compile error'
        message: '<%= error %>'
      .apply this, Array.prototype.slice.call arguments
      this.emit 'end'
    .pipe source 'simple-typing.js'
    .pipe gulp.dest 'example/'