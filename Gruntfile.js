'use strict';
var _ = require('underscore');
var LIVERELOAD_PORT = 35730;
var SERVER_PORT = 9010;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

var DEPENDENCY_PATHS = {
  jquery:            '../bower_components/jquery/dist/jquery'
  ,'jquery-dragon':  '../bower_components/jquery-dragon/src/jquery.dragon'
  ,'jquery-mousewheel':
      '../bower_components/jquery-mousewheel/jquery.mousewheel'
  ,backbone:         '../bower_components/backbone/backbone'
  ,underscore:       '../bower_components/underscore/underscore'
  ,mustache:         '../bower_components/mustache/mustache'
  ,text:             '../bower_components/requirejs-text/text'
  ,rekapi:           '../bower_components/rekapi/dist/rekapi'
  ,shifty:           '../bower_components/shifty/dist/shifty'

  // jshint maxlen: 120
  // jck-library-extensions
  ,'auto-update-textfield':
      '../bower_components/jck-library-extensions/src/backbone/auto-update-textfield/auto-update-textfield'
  ,'incrementer-field':
      '../bower_components/jck-library-extensions/src/backbone/incrementer-field/incrementer-field'
  ,tabs: '../bower_components/jck-library-extensions/src/backbone/tabs/tabs'
  ,pane: '../bower_components/jck-library-extensions/src/backbone/pane/pane'
  ,alert: '../bower_components/jck-library-extensions/src/backbone/alert/alert'
  ,modal: '../bower_components/jck-library-extensions/src/backbone/modal/modal'
};

var REQUIREJS_BASE_CONFIG = {
/* jshint maxlen: 100 */
// Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
  baseUrl: '<%= yeoman.app %>/scripts',
  optimize: 'none',
  shim: {
    underscore: {
      exports: '_'
    }
    ,backbone: {
      deps: [
        'underscore'
        ,'jquery'
      ]
      ,exports: 'Backbone'
    }
  },
  paths: DEPENDENCY_PATHS,
  // TODO: Figure out how to make sourcemaps work with grunt-usemin
  // https://github.com/yeoman/grunt-usemin/issues/30
  //generateSourceMaps: true,
  // required to support SourceMaps
  // http://requirejs.org/docs/errors.html#sourcemapcomments
  preserveLicenseComments: false,
  useStrict: true,
  wrap: true
  //uglify2: {} // https://github.com/mishoo/UglifyJS2
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'
// templateFramework: 'lodash'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: true
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
          '<%= yeoman.app %>/scripts/templates/*.{ejs,mustache,hbs}',
        ]
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      //},
      //test: {
        //files: ['<%= yeoman.app %>/scripts/{,*/}*.js', 'test/spec/**/*.js'],
        //tasks: ['test:true']
      }
    },
    connect: {
      options: {
        port: SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      debug: {
        path: 'http://localhost:3000'
      }
    },
    clean: {
      dist: ['.tmp', '<%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%= yeoman.app %>/scripts/vendor/*',
      ]
    },
    /* jshint camelcase:false */
    mocha_require_phantom: {
      options: {
        base: '.',
        main: 'test/main',
        requireLib: '<%= yeoman.app %>/bower_components/requirejs/require.js',
        files: ['test/spec/*.js']
      },
      debug: {
        options: {
          keepAlive: true
        }
      },
      auto: {
        options: {
          keepAlive: false
        }
      }
    },
    requirejs: {
      // Note: This target excludes all non-core dependency modules.
      dist: {
        options:
         _.extend({
          name: 'rekapi.timeline',
          out: '<%= yeoman.dist %>/rekapi.timeline.js',
          exclude: Object.keys(DEPENDENCY_PATHS)
        }, REQUIREJS_BASE_CONFIG)
      },
      demo: {
        options: _.extend({
          name: 'demo-main',
          out: '<%= yeoman.dist %>/demo/main.js'
        }, REQUIREJS_BASE_CONFIG)
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: '*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          src: ['.tmp/styles/main.css'],
          dest: '<%= yeoman.dist %>/styles/main.css'
        }, {
          src: ['app/bower_components/sass-bootstrap-glyphicons/css/bootstrap-glyphicons.css'],
          dest: '<%= yeoman.dist %>/demo/'
        }, {
          expand: true,
          src: ['app/bower_components/sass-bootstrap-glyphicons/fonts/*'],
          dest: '<%= yeoman.dist %>/demo/'
        }]
      }
    },
    bower: {
      all: {
        rjsConfig: '<%= yeoman.app %>/scripts/main.js'
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '/styles/fonts/{,*/}*.*'
          ]
        }
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles'
      },
      server: {
        options: {
          debugInfo: true
        }
      },
      dist: {}
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', /*'open:server',*/ 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'compass:server',
      'connect:livereload',
      //'open:server',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'compass',
    'mocha_require_phantom:auto',
  ]);

  grunt.registerTask('debug', [
    'clean:server',
    'compass',
    'open:debug',
    'mocha_require_phantom:debug'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'requirejs',
    'copy',
  ]);

  grunt.registerTask('default', [
    'jshint',
    'build'
  ]);
};
