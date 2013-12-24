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

	[
		'connecting', 
		'connect', 
		'reconnect', 
		'reconnecting', 
		'disconnect', 
		'connect_failed', 
		'error', 
		'reconnect_failed'
	].forEach(function(e){
		socket.on(e, function(){
			$scope.messages.push(e);
		});
	});
	
	socket.on('disconnect', function () {
		$scope.bellConnected = false;
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