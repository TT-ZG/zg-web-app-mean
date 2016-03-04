// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var createController = function($scope, $state, $stateParams, crudFactory, fileUpload){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than brother
    var brother = this;

    // set default values
    brother.userData = {};
    brother.userData.available = 'Unavailable';
    brother.userData.gpa = 'On Request';
    brother.userData.standing = 'Active';

    // The options available for standings
    brother.standings = [
      { property : "standing", value: "Active" },
      { property : "standing", value: "Alumni" },
    ];

    // The relevant options available for employment seeking status
    brother.availables = [
      { property : "available", value: "Internship" },
      { property : "available", value: "Full-Time" },
      { property : "available", value: "Part-Time" },
      { property : "available", value: "Unavailable"}
    ];

    // The gpa brackets
    brother.gpas = [
      { property : "gpa", value: "3.00 - 3.32" },
      { property : "gpa", value: "3.33 - 3.66" },
      { property : "gpa", value: "3.67 - 4.00" },
      { property : "gpa", value: "On Request" },
    ];

    // =========================================================================
    // =========================================================================
    // call a service to save a user
    brother.saveBrother = function() {
      // clear messages
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.create();
    };

    // =========================================================================
    // =========================================================================
    // create a brothers info
    brother.create = function(){
      // these are nested b/c we need id from create()
      crudFactory.create(brother.userData)
      .success(function(res){
        console.log(res.message);
        brother.dataMessage = res.message
        brother.uploadPicture(res.brotherId);
      })
      .error(function(res){
        console.log(res.message);
        brother.dataMessage = res.message
      });
    };

    // =========================================================================
    // =========================================================================
    // upload a brothers picture
    brother.uploadPicture = function(brotherId){
      var file = $scope.myFile;
      var method = 'POST';
      //console.dir(file);
      var uploadUrl = "/api/pictures/" + brotherId;

      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        console.log(data.message);
        brother.pictureMessage = data.message;
      });
    };

  };

  // =========================================================================
  // =========================================================================
    // For minification purposes
    createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('createController', createController);

}());
