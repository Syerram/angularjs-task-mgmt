//This is basically setting up our top level app.
var todoApp = angular.module('todoApp', []);

todoApp.factory('Data', function() {
	
	return {
		fetch_incomplete: function() {
			//query.equalTo("completed", false);
			return ['Django', 'Angular'];
		}, 
		save: function(todo_raw) {
			console.log('saving..');
			return todo_raw;
		}
	}
});

todoApp.controller('TodoCtrl', function($scope, Data) {
	$scope.todos = {
		new_todo: {
			title: '',
			save: function() {
				Data.save({title: $scope.todos.new_todo.title});
				$scope.todos.list.push($scope.todos.new_todo.title);
				$scope.todos.new_todo.title = '';
			}
		},
		list: [],
	};

	$scope.init = function() {
		$scope.todos.list = Data.fetch_incomplete();
	}
});