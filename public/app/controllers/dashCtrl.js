angular.module('dashCtrl', ['userService'])

// dashboard controller
.controller('dashController', function(User, $state) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// get all the users from the database
	User.all().success(function(data) {
		vm.users = data;
	});


	// ==============================================
	// CALL A SERVICE TO DELETE A USER
	// ==============================================
	vm.deleteUser = function(id) {
		vm.processing = true;

		User.delete(id)
			.success(function(data) {

				// get all users to update the table
				User.all()
					.success(function(data) {
						vm.processing = false;
						vm.users = data;
					});

			});
	};

})



// ================================================================================

.controller('adminController', function(User) {

})






// ==============================================
// INJECT DEPENDENCIES
// ==============================================
// controller applied to user creation page
.controller('userCreateController', function(User) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// ==============================================
	// CALL A SERVICE TO SAVE A USER
	// ==============================================
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the userService
		User.create(vm.userData)
			.success(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.message;
			});

	};

})

// ==============================================
// INJECT DEPENDENCIES
// ==============================================
// controller applied to user edit page
.controller('userEditController', function($routeParams, User) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	// variable to determine if we should hide/show elements of the view
	vm.type = 'edit';

	// ==============================================
	// GET THE USER TO EDIT BASED ON ID
	// ==============================================
	User.get($routeParams.user_id)
		.success(function(data) {
			vm.userData = data;
		});

	// ==============================================
	// SAVE THE USERS NEW INFORMATION
	// ==============================================
	vm.saveUser = function() {
		vm.processing = true;
		vm.message = '';

		// call the userService function to update
		User.update($routeParams.user_id, vm.userData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.userData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});
