/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    templates: 'templates',
    app: 'static',
    dist: 'static'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,
    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        livereload: true
      },
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['<%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['autoprefixer']
      },
      livereload: {
        files: [
          '<%= config.templates %>/{,*/}*.html',
          '<%= config.app %>/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },
    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        includePaths: ['bower_components']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.app %>/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%= config.app %>/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
        map: {
          prev: '<%= config.app %>/styles'
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/styles'
        }]
      }
    },
    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:5000'
      },
      prod: {
        path: 'http://sfchronicle.com'
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          // true would impact styles with attribute selectors
          removeRedundantAttributes: false,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= config.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= config.dist %>/scripts/scripts.js': [
    //         '<%= config.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*'
          ]
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'sass:server'
      ],
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    }
  });


  // New task for flask server
  grunt.registerTask('flask', 'Run flask server.', function() {
     var spawn = require('child_process').spawn;
     grunt.log.writeln('Starting Flask development server.');
     // stdio: 'inherit' let us see flask output in grunt
     var PIPE = {stdio: 'inherit'};
     spawn('python', ['main.py'], PIPE);
  });


  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function (target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'concurrent:server',
      'autoprefixer',
      'flask',
      'open:dev',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  // Build
  grunt.registerTask('build', [
    'rev',
    'usemin',
    'htmlmin',
    // 'wiredep', /* enable to let grunt autopopulate (base|index).html with bower components */
    'sass',
    'autoprefixer',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    // 'wiredep', /* enable to let grunt autopopulate (base|index).html with bower components */
    'sass',
    'autoprefixer',
    'watch'
  ]);
};
