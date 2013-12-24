module.controller('BellCtrl', ['$scope', '$routeParams', '$timeout', 
	function BellCtrl($scope, $routeParams, $timeout) {
  	$scope.id = $routeParams.id;
  	$scope.rings = [];
  	$scope.playBell = window.christmasBell.playBell;

    var socket = io.connect(socketPath);

  	socket.on('bell-changed', function (data) {
  		$scope.$apply(function(){
  			$scope.ropeConnected = data.ropeCount > 0;
  		});
  	});

  	socket.on('ringing', function (data) {
  		$timeout(function(){
        $scope.playBell();
  		}, data.delay*1000 || 0, true);	  		  		
  	});

  	socket.emit('connect-bell', {id: $scope.id});

  }]);