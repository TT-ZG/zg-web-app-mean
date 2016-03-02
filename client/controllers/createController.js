// best practice: wrap in function
(function() {

    var createController = function($scope, $state, $stateParams, crudFactory, fileUpload){

      // ***************************************
      // better to use 'controller as' rather than brother
      var brother = this;
      // variable to determine if we should hide/show elements of the view
    	brother.type = 'create';
    	// ***************************************
    	// call a service to save a user
    	brother.saveBrother = function() {

    		// use the create function in the userService
    		crudFactory.create(brother.userData, brother.files).success(function(data) {
    				brother.userData = {};
    				brother.message = data.message;
    			});
    	};



      $scope.uploadForm = function(){
       var file = $scope.myFile;
       // sometimes the browser doesn't like this
       console.log('file is ' + JSON.stringify(file));
       // this will definitely work
       console.dir(file);
       var uploadUrl = "/test";
       var fields = [{"name": "name1", "data": $scope.field1},
                     {"name": "name2", "data": $scope.field2}];
       fileUpload.uploadFileAndFieldsToUrl(file, fields, uploadUrl ,function(data, status, headers, config){
            if(status == 200)console.log('Success!');
            else console.log('Error!');
        });
      };



    };

    // ***************************************
    // For minification purposes
    createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('createController', createController);

}());
