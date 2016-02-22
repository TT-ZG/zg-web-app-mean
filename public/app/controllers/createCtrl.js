angular.module('createCtrl', ['userService'])

// *****************************************************************************
// controller for creating users
// *****************************************************************************
.controller('brotherCreateController', function(User, $state, $stateParams) {

	var vm = this;

	vm.type = 'create';

	//===========================================
	// call a service to save a user
	vm.saveUser = function() {
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData).success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;
			});
	};
});
