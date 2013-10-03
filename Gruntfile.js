var apiUtils = require('./api/utils'),
  listAPI = require('./api/list'),
  express = require('express'),
  mongoose = require('mongoose');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ejs');
  grunt.loadTasks('./lib/grunt');

  bowerJs = [
    'angular/angular.js',
    'angular-resource/angular-resource.js',
    'angular-route/angular-route.js',
    'angular-bootstrap/ui-bootstrap-tpls.js',
    'angular-bootstrap/ui-bootstrap.js'
  ].map(function (file) { return 'bower_components/' + file; });

  bowerCss = ['bower_components/bootstrap/docs/assets/css/bootstrap.css'];

  grunt.initConfig({
    concat: {
      dist: {
        options: {
          banner: "(function (angular) {\n'use strict';\n",
          process: function (src, filepath) {
            return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
          },
          footer: "\n})(angular);"
        },
        src: (function () {
          var controllers = grunt.file.expand('dist/controllers/*.js'),
            directives = grunt.file.expand('dist/directives/*.js'),
            services = grunt.file.expand('dist/services/*.js');
          return []
            .concat(['dist/app.js'], controllers, directives, services)
            .filter(function (file) {
              return !/\.spec\.js$/.test(file);
            });

        })(),
        dest: 'dist/todo.js'
      }
    },
    connect: {
      options: {
        port: 8080,
        base: 'dist',
        middleware: function (connect, options) {
          return [
            connect.logger('dev'),
            connect.static(options.base),
            connect.directory(options.base)
          ];
        }
      },
      dev: {
        options: {
          name: 'devserver.1'
        }
      },
      prod: {
        options: {
          name: 'prodserver.1',
          keepalive: true
        }
      }
    },
    mean: {
      options: {
        port: 8080,
        base: 'dist',
        setup: function (app, options, callback) {
          app.use(express.logger('dev'));
          app.use(express.static(options.base));
          app.use(express.json());
          
          mongoose.connect(options.mongoUri, options.mongoSettings, function () {
            console.log('After mongoose.connect, arguments is: ' + JSON.stringify(arguments));
            var listAPI = require('./api/list')(mongoose);
            app.get('/api/list', apiUtils.createAPI(listAPI.getTodoList));
            app.post('/api/task', apiUtils.createAPI(listAPI.addTodoListItem));
            callback(app);
          });
        }
      },
      dev: {},
      prod: {
        options: {
          keepalive: true
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'todo/', src: '**', dest: 'dist/'}
        ]
      }
    },
    ejs: {
      dev: {
        options: {
          vendorCss: bowerCss,
          vendorJs: bowerJs
        },
        src: 'dist/index.ejs',
        dest: 'dist/index.html'
      }
    },
    watch: {
      server: {
        files: 'todo/**/*',
        tasks: ['copy', 'concat', 'ejs:dev'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('webserver', ['copy', 'concat', 'ejs:dev', 'mean:dev', 'watch:server']);
};