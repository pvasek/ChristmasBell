function generateId() {
		return Math.floor((1 + Math.random()) * 100000)
     .toString();	  		
}

var module = angular.module('ChirstmasBellApp', ['ngRoute']);
module.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
	$routeProvider
		.when('/bell/:id', {templateUrl: '/templates/bell.html', controller: 'BellCtrl'})
		.when('/rope/:id?', {templateUrl: '/templates/rope.html', controller: 'RopeCtrl'})
		.when('/', {templateUrl: '/templates/intro.html', controller: 'HomeCtrl'})
		.otherwise({redirectTo: '/'});

	$locationProvider.html5Mode(true);
}]);

module.controller('MainCtrl', ['$scope', function MainCtrl($scope) {
}]);

module.controller('HomeCtrl', ['$scope', '$routeParams', '$location', 
	function HomeCtrl($scope, $routeParams, $location) {
		$scope.id = generateId();
	}]);
