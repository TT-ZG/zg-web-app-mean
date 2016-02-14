angular.module('authService', [])

// *****************************************************************************
// this factory handles authentication services
// *****************************************************************************
.factory('Auth', function($http, $q, AuthToken) {

	//factories return objects
	var authFactory = {};

	//============================================
	// post credentials to host/api/authenticate
	authFactory.login = function(username, password) {

		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
		.success(function(data) {
			AuthToken.setToken(data.token);
			console.log("User has successfully logged on.");
       return data;
		});
	};

	//============================================
	// log user out, set token to nothing
	//set token to nothing
	authFactory.logout = function() {
		AuthToken.setToken();
		console.log("User has successfully logged off.");
	};

	//============================================
	// check if user is logged on by checking browsers storage for a token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	//============================================
	// get the current users info
	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me', { cache: true });
		else
			return $q.reject({ message: 'User has no token.' });
	};

	// factories return objects
	return authFactory;

})

// *****************************************************************************
// this factory handles tokens
// *****************************************************************************
// for handling tokens, inject  $window to store token client-side
.factory('AuthToken', function($window) {

	// factories return objects
	var authTokenFactory = {};

	//============================================
	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	//============================================
	// set or clear the token
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	// factories return objects
	return authTokenFactory;

})

// *****************************************************************************
// intercept requests and resposnes, send token on every request, http is stateless
// *****************************************************************************
.factory('AuthInterceptor', function($q, $location, $injector, AuthToken) {

	// factories return objects
	var interceptorFactory = {};

	// ===========================================
	// intercept http reqests before they happen
	interceptorFactory.request = function(config) {

		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access-token
		if (token) config.headers['x-access-token'] = token;

		return config;
	};

	// ===========================================
	// intercept http responses before they are sent
	interceptorFactory.responseError = function(response) {

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			AuthToken.setToken();
			console.log("Unauthorized. Redirecting to home.");
			$injector.get('$state').transitionTo('home');
		}

		// return the errors from the server as a promise
		return $q.reject(response);
	};

	// factories return objects
	return interceptorFactory;

});
