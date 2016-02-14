angular.module('userService', [])

// *****************************************************************************
// for making requests to the API
// *****************************************************************************
.factory('User', function($http) {

	///===========================================
	// factories return objects
	var userFactory = {};

	///===========================================
	// get a single user
	userFactory.get = function(id) {
		return $http.get('/api/users/' + id);
	};

	///===========================================
	// get all users
	userFactory.all = function() {
		return $http.get('/api/users/');
	};

	///===========================================
	// create a user
	userFactory.create = function(userData) {
		return $http.post('/api/users/', userData);
	};

	///===========================================
	// update a user
	userFactory.update = function(id, userData) {
		return $http.put('/api/users/' + id, userData);
	};

	///===========================================
	// delete a user
	userFactory.delete = function(id) {
		return $http.delete('/api/users/' + id);
	};

	///===========================================
	// factories return objects
	return userFactory;

});
