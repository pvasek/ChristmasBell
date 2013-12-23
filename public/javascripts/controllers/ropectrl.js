module.controller('RopeCtrl', ['$scope', '$routeParams', function RopeCtrl($scope, $routeParams) {
	$routeParams.id;
	
	var socket = io.connect(socketPath);

	socket.on('bell-changed', function (data) {
		$scope.$apply(function(){
			$scope.bellConnected = data.bellCount > 0;
		});
	});



	$scope.ringTheBell = function(){
		socket.emit('ring-bell', {id: $scope.id});
	};

	$scope.connect = function(id) {
		$scope.id = id;
		if (id) {
			console.log('connect');
			socket.emit('connect-rope', {id: id});
		}      
    };

    $scope.connect($routeParams.id);
}]);