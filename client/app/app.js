// register the module and dependencies here
angular.module('routes', []);

// register the application and inject all the necessary dependencies
var app = angular.module('zgApp', ['ui.router', 'ui.bootstrap', 'routes']);

// application configuration
app.config([ '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($urlRouterProvider, $locationProvider, $httpProvider) {

    // get rid of angular octothorps
    $locationProvider.html5Mode(true);

    // go to the '/home' URL if an invalid route is provided
    $urlRouterProvider.otherwise('/visitors/home');

    // attach our auth interceptor
    $httpProvider.interceptors.push('Interceptor');
  }
]);

/* set the initial state of the application */
app.run(['$state', function($state) {
    $state.go('visitors.home');
  }
]);

/*
// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests to verify tokens
	// think of interceptors as middleware for http requests in angular
	$httpProvider.interceptors.push('AuthInterceptor');

});
*/
