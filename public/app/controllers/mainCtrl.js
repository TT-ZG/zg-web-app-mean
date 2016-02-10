angular.module('mainCtrl', [])

// ==============================================
// INJECT DEPENDENCIES
// ==============================================
.controller('mainController', function($rootScope, $location, Auth) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	// ==============================================
	// CALL A SERVICE TO CHECK IF LOGGED ON
	// ==============================================
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();

		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});

	// ==============================================
	// CALL A SERVICE TO LOGIN A USER
	// ==============================================
	vm.doLogin = function() {
		vm.processing = true;

		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;

				// if a user successfully logs in, redirect to users page
				if (data.success)
					$location.path('/users');
				else
					vm.error = data.message;

			});
	};

	// ==============================================
	// CALL A SERVICE TO LOGOUT A USER
	// ==============================================
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};

});
