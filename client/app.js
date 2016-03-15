// best practice: wrap in function
(function() {

// register the module and dependencies here
angular.module('routes', []);

// register the application and inject all the necessary dependencies
var app = angular.module('zgApp', ['ui.router', 'ui.bootstrap', 'routes', 'ngAnimate', 'ngSanitize', 'ngCookies']);

// application configuration
app.config([ '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function($urlRouterProvider, $locationProvider, $httpProvider) {

    // get rid of angular octothorps
    $locationProvider.html5Mode(true);

    // go to the '/home' URL if an invalid route is provided
    $urlRouterProvider.otherwise('/home');

    // attach our auth interceptor
    $httpProvider.interceptors.push('interceptFactory');
  }
]);

/* set the initial state of the application */
app.run(['$state', function($state) {
    $state.go('main.home');
  }
]);

}());
