'use strict';

angular.module('todoApp')
  .controller('TodoCtrl', ['$scope', '$resource', function ($scope, $resource) {
    var Task = $resource('/api/task');
    var List = $resource('/api/list');
    $scope.todos = [];
    List.query().$promise.then(function (todos) {
      $scope.todos = todos;
    });

    $scope.submit = function () {
      var task, dueDate;

      dueDate = $scope.taskDue || (function () {
        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      })();

      console.log('Submitted task text: ' + $scope.taskText + ' due date: ' + dueDate);
      task = new Task({
        text: $scope.taskText,
        due: dueDate
      });
      task.$save().then(function (todo) {
        $scope.todos.push(todo);
      });
    };
  }]);