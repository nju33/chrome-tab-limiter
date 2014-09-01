module.exports = (grunt) ->
  require('load-grunt-tasks')(grunt)
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    src:
      sass: 'src/sass'
      coffee: 'src/coffee'
    dev:
      root: 'dev'
      css: 'dev/css'
      js: 'dev/js'
    dist:
     root: 'dist'
     css: 'dist/css'
     js: 'dist/js'
    config: 'config'

    copy:
      dist:
        expand: true
        cwd: '<%= dev.root %>'
        src: '**/*'
        dest: '<%= dist.root %>'

    compress:
      options: archive: '<%= pkg.name %>.zip'
      dist:
        files: [
          {
            expand: true
            cwd: '<%= dist.root %>'
            src: '**/*'
          }
        ]

    imagemin:
      watch:
        expand: true
        src: '<%= dist.root %>/**/*.{png,jpg,jpeg,gif}'


    htmlmin:
      options:
        removeComments: true
        collapseWhitespace: true
        collapseBooleanAttributes: true
        minifyJS: true
        minifyCSS: true
      build: { expand: true, src: '<%= dist.root %>**/*.html' }


    sass:
      options:
        style: 'expanded'
        loadPath: '/.web/sass'
      watch:
        expand: true
        src: '<%= src.sass %>/**/*.{sass,scss}'
        dest: '<%= dev.css %>'
        ext: '.css'
        flatten: true

    cmq:
      options: log: true
      build:
        src: '<%= dist.css %>/*.css'
        dest: '<%= dist.css %>'

    csscomb:
      build:
        expand: true
        src: '<%= cmq.build.src %>'

    csso:
      build:
        expand: true
        src: '<%= cmq.build.src %>'

    browserify:
      options:
        transform: ['coffeeify', 'debowerify']
        browserifyOptions:
          extensions: ['.coffee']
          debug: true

      dev:
        files: [
          '<%= dev.js %>/background.js': '<%= src.coffee %>/background.coffee'
          '<%= dev.js %>/option.js': '<%= src.coffee %>/option.coffee'
        ]

    uglify:
      build:
        expand: true
        cwd: '<%= dist.js %>'
        src: ['**/*.js']
        dest: '<%= dist.js %>'

    watch:
      sass: {files: '<%= sass.watch.src %>', tasks: 'sass'}
      coffee: {files: '<%= src.coffee %>/**/*.coffee', tasks: 'browserify'}
      ng: {files: '<%= coffee.ng.src %>', tasks: 'coffee:ng'}


  grunt.registerTask 'default', ['watch']
  grunt.registerTask 'dist', ['copy', 'htmlmin', 'cmq', 'csscomb', 'csso', 'uglify', 'imagemin', 'compress']
  grunt.registerTask 'all', ['sass', 'browserify' ,'copy', 'htmlmin', 'cmq', 'csscomb', 'csso', 'uglify', 'imagemin', 'compress']
