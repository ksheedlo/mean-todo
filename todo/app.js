'use strict';

angular.module('todoApp', ['ngResource', 'ngRoute', 'ui.bootstrap.tpls', 'ui.bootstrap'])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);
  }]);