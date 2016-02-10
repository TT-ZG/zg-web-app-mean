angular.module('authService', [])

// ===============================================
// INJECT DEPENDENCIES
// ==============================================
.factory('Auth', function($http, $q, AuthToken) {

	// factories return objects
	var authFactory = {};

	// ==============================================
	// LOG A USER IN
	// ==============================================
	// post credentials to host/api/authenticate
	authFactory.login = function(username, password) {

		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
			.success(function(data) {
				AuthToken.setToken(data.token);
       			return data;
			});
	};

	// ==============================================
	// LOG A USER OUT
	// ==============================================
	//set token to nothing
	authFactory.logout = function() {
		// clear the token
		AuthToken.setToken();
	};

	// ==============================================
	// CHECK IF A USER IS LOGGED IN
	// ==============================================
	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	// ==============================================
	// GET THE CURRENT USERS INFORMATION
	// ==============================================
	authFactory.getUser = function() {
		if (AuthToken.getToken())
			return $http.get('/api/me', { cache: true });
		else
			return $q.reject({ message: 'User has no token.' });
	};

	// ==============================================
	// CREATE A SAMPLE USER
	// ==============================================
	authFactory.createSampleUser = function() {
		$http.post('/api/sample');
	};

	// return auth factory object
	return authFactory;

})

// ===================================================
// INJECT DEPENDENCIES
// ===================================================
// for handling tokens, inject  $window to store token client-side
.factory('AuthToken', function($window) {

	//factories return objects
	var authTokenFactory = {};

	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

})

// ===================================================
// INJECT DEPENDENCIES
// ===================================================
// send token on every request, http is stateless
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	// factories return objects
	var interceptorFactory = {};

	// ===================================================
	// THIS HAPPENS ON ALL HTTP REQUESTS
	// ===================================================
	interceptorFactory.request = function(config) {

		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access-token
		if (token)
			config.headers['x-access-token'] = token;

		return config;
	};

	// ===================================================
	// REDIRECT TO HOMEPAGE IF THERE IS AN ERROR
	// ===================================================
	interceptorFactory.responseError = function(response) {

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		// return the errors from the server as a promise
		return $q.reject(response);
	};

	return interceptorFactory;

});
