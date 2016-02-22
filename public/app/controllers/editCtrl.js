angular.module('editCtrl', ['userService'])

// *****************************************************************************
// controller for editing
// *****************************************************************************
.controller('brotherEditController', function(User, $state, $stateParams) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// variable to determine if we should hide/show elements of the view
	vm.type = 'edit';

	//===========================================
	// call a service to get a specific user
	User.get($stateParams.brotherid).success(function(data) {
			vm.userData = data;
		});

	//===========================================
	// call a service to edit a specific user
	vm.saveUser = function() {
		vm.message = '';

		User.update($stateParams.brotherid, vm.userData).success(function(data) {
				vm.userData = {};
				vm.message = data.message;
			});
	};
});
