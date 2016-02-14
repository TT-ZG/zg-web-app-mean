angular.module('dashCtrl', ['userService'])

// =============================================================================
// main controller that handles the brother dashboard
// =============================================================================
.controller('dashController', function(User, $state, $stateParams) {

	//============================================================================
	// better to use 'controller as' rather than $scope
	var vm = this;

	//============================================================================
	// set the id in scope because uirouter doesn't accept angular exp as parameters
	vm.setID = function(id){
		vm.desiredID = id;
	}

	//============================================================================
	// get all the users from the database
	// all other controllers are children of this one
	// therefore api will reject any request to dashboard/* unless verified
	User.all().success(function(data) {
		vm.brothers = data;
	});

	//============================================================================
	// call a service to delete a user
	vm.deleteUser = function(id) {
		User.delete(id).success(function(data) {
				// get all users to update the table
				User.all().success(function(data) {
						vm.brothers = data;
					});
			});
	};

})

// =============================================================================
// controller for creating users
// =============================================================================
.controller('brotherCreateController', function(User, $state, $stateParams) {

	var vm = this;

	vm.type = 'create';

	//============================================================================
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
})

// =============================================================================
// controller for editing
// =============================================================================
.controller('brotherEditController', function(User, $state, $stateParams) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// variable to determine if we should hide/show elements of the view
	vm.type = 'edit';

	//============================================================================
	// call a service to get a specific user
	User.get($stateParams.brotherid).success(function(data) {
			vm.userData = data;
		});

	//============================================================================
	// call a service to edit a specific user
	vm.saveUser = function() {
		vm.message = '';

		User.update($stateParams.user_id, vm.userData).success(function(data) {
				vm.userData = {};
				vm.message = data.message;
			});
	};
});
