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

todoApp.directive('avatar', function($http) {
	return {
		restrict: 'A', //E: element, C: class name, M: comments
		template: '<div class="thumbnail" style="width: 48px;height:48px;margin-bottom: 30px;">' + 
			'<div><img ng-src="{{data.owner.avatar_url}}"/></div>' + 
			'<div class="caption"><p>{{data.name}}</p></div></div>', //use templateUrl
		//scope: true, //prototypically inherits
		link: function(scope, element, attrs) {
	      /*$http.get('https://github.com/Syerram/angularjs-intro').success(function(data) {
	        scope.data = data;
	      });*/
		  scope.data = {owner: {avatar_url: '../static/img/avatar.jpg'}, name: 'Sai'};
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