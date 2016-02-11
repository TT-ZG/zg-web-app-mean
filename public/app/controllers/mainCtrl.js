angular.module('mainCtrl', [])


//==============================================================================
// mainController belongs to <body>, has control of entire app
//==============================================================================
.controller('mainController', function($rootScope, $location, Auth) {


	//============================================================================
	// initialize variables when this app is loaded
	//============================================================================
	// 'controller as' rather than $scope
	var vm = this;

	// set initial login state
	vm.loggedIn = Auth.isLoggedIn();


	//============================================================================
	// every time someone accesses a page on the app
	//============================================================================
	$rootScope.$on('$routeChangeStart', function() {

		// set their logged in status
		vm.loggedIn = Auth.isLoggedIn();

		// get their data
		Auth.getUser().then(function(data){
			vm.user = data.data;
		});

		// display their login state
		console.log('User login state: ' + vm.loggedIn);
	});


	//============================================================================
	// takes form submitted data and logs in the user
	//============================================================================
	vm.doLogin = function() {

		// set a spinner as true while fetching
		vm.processing = true;

		//clear any errors
		vm.error = '';

		//use authService.js to log in the user
		Auth.login(vm.loginData.username, vm.loginData.password).success(function(data) {

			// end the spinner
			vm.processing = false;

			// redirect to users page, else set an error
			if (data.success)
				$location.path('/users');
			else
				vm.error = data.message;
		});
	};


	//============================================================================
	// logs the user out, clears variables, and redirects to /login
	//============================================================================
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';
		$location.path('/login');
	};

});
