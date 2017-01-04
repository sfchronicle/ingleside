/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

var path = require("path");

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
        files: ['bower.json']
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
        tasks: ['sass:server', 'postcss']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['postcss']
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
    postcss: {
      options: {
        map: {
          inline: true
        },
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
        
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
    },

    // Task that copies 'build' directory to the staging/production server
    sync: {
      staging: {
        files: [
          { expand: true, cwd: 'build/', src: ['**'], dest: '//Volumes/SFGextras/Projects/test-proj/<%= grunt.data.json.project.test_slug %>'}
        ],
        verbose: true, // Default: false
        failOnError: true, // Fail the task when copying is not possible. Default: false
        updateAndDelete: true, // Remove all files from dest that are not found in src. Default: false
        compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
      },
      production:{
        files: [
          { expand: true, cwd: 'build/', src: ['**'], dest: '//Volumes/SFGextras/Projects/2017/<%= grunt.data.json.project.slug %>'}
        ],
        verbose: true, // Default: false
        failOnError: true, // Fail the task when copying is not possible. Default: false
        updateAndDelete: true, // Remove all files from dest that are not found in src. Default: false
        compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
      }
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

  grunt.registerTask('default', 'start the server and preview your app', function () {
    grunt.task.run([
      'concurrent:server',
      'postcss',
      'state',
      'json',
      'flask',
      'open:dev',
      'watch'
    ]);
  });

  /*
  This module sets up a `grunt.data` object to be used for shared state between
  modules on each run. Modules that use it should require this task to make sure
  that they get a clean state on each run. If Grunt starts emitting events,
  we'll use those to automatically initialize.
  */
  grunt.registerTask("state", "Initializes the shared state object", function() {
    grunt.data = {};
  });

  /*
  Loads the project.json file, as well as any matching files in the /data
  folder, and attaches it to the grunt.data object as grunt.data.json.
  */
  grunt.registerTask("json", "Load JSON for templating", function() {
    var files = grunt.file.expand(["project.json", "data/**/*.json"]);
    grunt.task.requires("state");
    grunt.data.json = {};

    files.forEach(function(file) {
      var json = grunt.file.readJSON(file);
      var name = path.basename(file).replace(/(\.sheet)?\.json$/, "");
      grunt.data.json[name] = json;
    });

  });
};