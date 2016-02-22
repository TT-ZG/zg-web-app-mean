angular.module('loginCtrl', ['authService'])

// *****************************************************************************
// main controller that handles logging in and state monitoring
// *****************************************************************************
.controller('loginController', function($rootScope, $state, Auth) {

	///===========================================
	// better to use 'controller as' rather than $scope
	var vm = this;

	// get info if a person is logged in
	vm.loggedIn = Auth.isLoggedIn();

	///===========================================
	// on every change of state, fetch and update the users data and status
	$rootScope.$on('$stateChangeStart', function(toState) {

		vm.loggedIn = Auth.isLoggedIn();
		Auth.getUser().then(function(data) {
				vm.user = data.data;
			});
	});

	///===========================================
	//use authService.js to log in a user
	vm.doLogin = function() {

		// clear error
		vm.error = '';

    //redirect as necessary
		Auth.login(vm.loginData.username, vm.loginData.password).success(function(data) {
			if (data.success)
        $state.go('dashboard');
			else
        vm.error = data.message;
			});
	};

	///===========================================
  //use authService.js to log out a user
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		$state.go('home');
	};
});
