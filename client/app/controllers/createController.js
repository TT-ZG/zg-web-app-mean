// best practice: wrap in function
(function() {

    var createController = function($state, $stateParams, crudFactory){

      var brother = this;

    	brother.type = 'create';

    	//===========================================
    	// call a service to save a user
    	brother.saveBrother = function() {
    		brother.message = '';

    		// use the create function in the userService
    		crudFactory.create(brother.userData).success(function(data) {
    				brother.userData = {};
    				brother.message = data.message;
    			});
    	};
    };

    createController.$inject = ['$state', '$stateParams', 'crudFactory'];

    angular.module('zgApp').controller('createController', createController);

}());
