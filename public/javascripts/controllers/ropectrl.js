module.controller('RopeCtrl', ['$scope', '$routeParams', function RopeCtrl($scope, $routeParams) {
	
	$scope.messages = [];
	$scope.bellConnected = false;

	var socket = io.connect(socketPath);

	socket.on('bell-changed', function (data) {
		console.log('bell-changed');
		console.log(data);
		$scope.$apply(function(){
			$scope.bellConnected = data.bellCount > 0;
		});
	});

	socket.on('disconnect', function () {
		$scope.bellConnected = false;
		$scope.messages.push("disconnect");
	});

	socket.on('connect_failed', function () {
		$scope.messages.push("connection failed");
	});

	socket.on('error', function () {
		$scope.messages.push("connection failed");
	});

	socket.on('reconnect_failed', function () {
		$scope.messages.push("reconnection failed");
	});


	$scope.ringTheBell = function(delay){		
		socket.emit('ring-bell', {id: $scope.id, delay: delay}, function(data) {
			$scope.scheduled = true;
			$scope.scheduledId = data.scheduledId;
		});
	};

	$scope.connect = function(id) {
		$scope.id = id;
		if (id) {
			console.log('connect-rope');
			socket.emit('connect-rope', {id: id});
		}      
    };

    $scope.connect($routeParams.id);
}]);