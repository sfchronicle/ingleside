/*jshint node:true*/

// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

var path = require("path");

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
        livereload: true
      },
      bower: {
        files: ['bower.json']
      },
      js: {
        files: ['static/scripts/**/*.js'],
        tasks: ['jshint']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      sass: {
        files: ['static/styles/**/*.{scss,sass}'],
        tasks: ['sass:server', 'postcss']
      },
      reload: {
        files: ['templates/**/*.html','static/images/**/*']
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
        'static/scripts/**/*.js'
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
          cwd: 'static/styles',
          src: ['*.{scss,sass}'],
          dest: 'static/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: 'static/styles',
          src: ['*.{scss,sass}'],
          dest: 'static/styles',
          ext: '.css'
        }]
      }
    },

    // Add vendor prefixed styles
    postcss: {
      options: {
        map: {
          inline: false
        },
        processors: [
          require('autoprefixer')({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'] })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'static/styles',
          src: ['*.css'],
          dest: 'static/styles',
        }]
      }
    },

    open: {
      dev: {
        path: 'http://127.0.0.1:5000'
      },
      prod: {
        path: 'http://projects.sfchronicle.com/2017/<%= grunt.data.json.project.production_path %>'
      }
    },

    // Run build.py file to serve static files 
    run: {
      options: {
        stdout: true,
        stderr: true,
      },
      staging: {
        exec: 'python build.py staging'
      },
      production: {
        exec: 'python build.py production'
      }
    },

    // Converts .html files to .php
    copy: {
      production: {
        files: [{
          expand: true,
          cwd: 'build/',
          src: ['**/*.html'],
          dest: 'build/',
          rename: function (dest, src) {
            return dest + src.replace('.html','.php');
          }
        }]
      }
    },

    // Deletes .html files from build folder
    clean: [
      'build/**/*.html'
    ],

    // Task that copies 'build' directory to the staging/production server
    sync: {
      staging: {
        files: [
          { expand: true, cwd: 'build/', src: ['**'], dest: process.env.STAGING_PATH + '<%= grunt.data.json.project.staging_path %>'}
        ],
        failOnError: true, // Fail the task when copying is not possible. Default: false
        updateAndDelete: true, // Remove all files from dest that are not found in src. Default: false
        compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
      },
      production:{
        files: [
          { expand: true, cwd: 'build/', src: ['**'], dest: process.env.PRODUCTION_PATH + '<%= grunt.data.json.project.production_path %>' }
        ],
        failOnError: true, // Fail the task when copying is not possible. Default: false
        updateAndDelete: true, // Remove all files from dest that are not found in src. Default: false
        compareUsing: "md5" // compares via md5 hash of file contents, instead of file modification time. Default: "mtime"
      }
    }

  });



  // Bring up flask server
  grunt.registerTask('flask', 'Run flask server.', function() {
     var spawn = require('child_process').spawn;
     grunt.log.writeln('Starting Flask development server.');
     // stdio: 'inherit' let us see flask output in grunt
     var PIPE = {stdio: 'inherit'};
     spawn('python', ['main.py'], PIPE);
  });

  grunt.registerTask('default', [
    'sass:server',
    'postcss',
    'flask',
    'state',
    'json',
    'open:dev',
    'watch'
  ]);

  // Build static files; defaults to staging. Command = 'grunt build:production'
  grunt.registerTask('build', function(target) {
    if (target) {
      grunt.task.run (['run:' + target, 'copy', 'clean']);
    } else {
      grunt.task.run(['run:staging', 'copy', 'clean']);
    }
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