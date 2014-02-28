function FirstCtrl($scope) {
	$scope.data = {
		message: 'Nothing here',
		save: function() {
			console.log(this.message); //pass to server
		}
	};
}

function SecondCtrl($scope) {
	$scope.todos = {
		new_todo: {
			title: '',
			save: function() {
				$scope.todos.list.push(this.title);
				$scope.todos.new_todo.title = '';

			}
		},
		list: [],
	};
}