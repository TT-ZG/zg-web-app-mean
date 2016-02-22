// app.js
angular.module('routerApp', [
	'authService',
	'userService',
	'loginCtrl',
	'dashCtrl',
	'editCtrl',
	'createCtrl',
	'app.routes'
])


// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests to verify tokens
	// think of interceptors as middleware for http requests in angular
	$httpProvider.interceptors.push('AuthInterceptor');

});
