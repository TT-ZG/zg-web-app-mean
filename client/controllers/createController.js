// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var createController = function($scope, $state, $stateParams, crudFactory, fileUpload){

      // ***************************************
      // better to use 'controller as' rather than brother
      var brother = this;
      // set default values
      brother.userData = {};
      brother.userData.available = 'Unavailable';
      brother.userData.gpa = 'On Request';
      brother.userData.standing = 'Active';

    	// ***************************************
    	// call a service to save a user
    	brother.saveBrother = function() {

        // clear messages
        brother.dataMessage = '';
        brother.pictureMessage = '';

    		// use the create function in the userService
    		crudFactory.create(brother.userData, brother.files).success(function(data) {
    				brother.dataMessage = data.message;
            brother.uploadPicture(data.brotherId);
            brother.userData = {};
    			});
    	};

      // ***************************************
      // separate custom http req for uploading a picture
      brother.uploadPicture = function(brotherId){
        var file = $scope.myFile;
        //console.dir(file);

        // if they've uploaded a file
        if (file){
          console.log('Uploading picture...');
          var uploadUrl = "/api/pictures/" + brotherId;

          // save the brothers picture using special service
          fileUpload.upload(file, uploadUrl, function(data, status, headers, config){
            if (status == 200)
              brother.pictureMessage = data.message;
            else
              console.log('Picture not uploaded.');
          });
        }
      };
    };

    // ***************************************
    // For minification purposes
    createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('createController', createController);

}());
