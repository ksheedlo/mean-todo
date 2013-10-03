var express = require('express'),
  http = require('http');

module.exports = function (grunt) {
  var server = {};

  var defaultSetup = function (app, options, callback) {
    callback(app);
  };

  grunt.registerMultiTask('mean', 'run a MEAN stack', function () {
    var app = express(),
      cb, options;

    options = this.options({
      port: 8080,
      setup: function () {},
      base: '.',
      keepalive: false,
      name: 'x.1',
      trustProxy: false,
      mongoSettings: {},
      mongoUri: 'mongodb://localhost/test'
    });

    done = options.keepalive === true ? undefined : this.async();

    if (options.trustProxy) {
      app.enable('trust proxy');
    }
    options.setup(app, options, function (apiServer) {
      var startListening = function () {
        server[options.name] = http.createServer(apiServer);
        server[options.name].listen(options.port, done);
      };
      if (server[options.name]) {
        server[options.name].close(startListening);
      } else {
        startListening();
      }
    });

  });
};