angular.module('dashCtrl', ['userService'])

// *****************************************************************************
// main controller that handles the brother dashboard
// *****************************************************************************
.controller('dashController', function(User, $state, $stateParams) {

	// better to use 'controller as' rather than $scope
	var vm = this;

	//===========================================
	// set the id in scope because uirouter doesn't accept angular exp as parameters
	vm.setID = function(id){
		vm.desiredID = id;
	}

	//===========================================
	// get all the users from the database
	// all other controllers are children of this one
	// therefore api will reject any request to dashboard/* unless verified
	User.all().success(function(data) {
		vm.brothers = data;
	});

	//===========================================
	// call a service to delete a user
	vm.deleteUser = function(id) {
		User.delete(id).success(function(data) {
				// get all users to update the table
				User.all().success(function(data) {
						vm.brothers = data;
					});
			});
	};

});
