//This is basically setting up our top level app.
var todoApp = angular.module('todoApp', []);

todoApp.run(function($rootScope) {
	Parse.initialize("NadlNjUewSAr5NATyWvTclajLbG1NOlv9ZRGvjYc", "Zr9CbbrMeYZ6SdgYZggETuxCOlcRdOHLO5Yfx9LX");
});

//moves this to directives.js
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

todoApp.directive('sorter', function($rootScope) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var removeIntent = false;
			element.sortable({
				over: function () {
                	removeIntent = false;
            	},
            	out: function () {
                	removeIntent = true;
            	},
            	beforeStop: function (event, ui) {
                	if(removeIntent == true){
                		$rootScope.$broadcast('todo_removed', {'title': ui.item.data('title')});
                    	ui.item.remove();
                	}
            	}
			});
		}
	}
})


todoApp.factory('Data', function() {
	var Todo = Parse.Object.extend("Todo");
	var query = new Parse.Query(Todo);

	return {
		fetch_incomplete: function(cb) {
			//query.equalTo("completed", false);
			query.find({
				success: function(results) {
					cb(results);
				},
				error: function(error) {
					alert(error);
				}
			});
		}, 
		save: function(todo_raw, cb) {
			var todo = new Todo();
			todo.set("title", todo_raw.title);
			todo.set("completed", false);
			todo.save(null, {
				success: function(saved_todo) {
					cb(saved_todo);
				},
				error: function(todo, errr) {
					alert(err);
				}
			});
		},
		update: function(todo, cb) {
			todo.save(null, {
				success: function(updated_todo) {
					cb(updated_todo);
				}
			});
		},
		remove: function(remove_todo, cb) {
			remove_todo.destroy({
				success: function() {
					cb();
				},
				error: function(obj, err) {
					console.log(err);
				}
			});
		}
	}
});

todoApp.controller('TodoCtrl', function($scope, $rootScope, Data) {
	$scope.todos = {
		new_todo: {
			title: '',
			save: function() {
				Data.save({title: $scope.todos.new_todo.title}, function(saved_todo) {
					$scope.$apply(function() {
						$scope.todos.list.push(saved_todo);
						$scope.todos.new_todo.title = '';	
					});
				});
			}
		},
		list: [],
		complete: function(todo) {
			todo.set("complete", true);
			Data.update(todo, function(updated_todo) {
				for(i=0;i<$scope.todos.list.length;i++) {
					if($scope.todos.list[i].attributes.title == updated_todo.attributes.title) {
						$scope.$apply(function() {
							$scope.todos.list.splice(i, 1);
						});						
						break;
					}
				}
			});
		},
	};

	$scope.init = function() {
		Data.fetch_incomplete(function(results) {
			$scope.$apply(function() {
				$scope.todos.list = results;
				console.log($scope.todos.list);
			});
		})
	}

	$rootScope.$on('todo_removed', function(e, arg) {
		for(i=0;i<$scope.todos.list.length;i++) {
			if($scope.todos.list[i].attributes.title == arg.title) {
				Data.remove($scope.todos.list[i], function() {
					$scope.$apply(function() {
						$scope.todos.list.splice(i, 1);	
					});
				});
				break;
			}
		}
	});
});