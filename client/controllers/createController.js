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

      //chop off the last item from the array if it is blank
      var lastItem = brother.userData.internships.length-1;
      if (brother.userData.internships[lastItem].name === undefined){
        brother.userData.internships.splice(lastItem);
      }

      // these are nested b/c we need id from create()
      crudFactory.create(brother.userData)
      .success(function(res){
        console.log(res.message);
        brother.dataMessage = res.message
        brother.uploadPicture(res.brotherId);
        // if we shaved off the example because they entered nothing, reset
        if (brother.userData.internships.length === 0){
          brother.generateInternships();
        }
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

    // =========================================================================
    // =========================================================================
    // for image preview
    $scope.setFile = function(element) {
      $scope.currentFile = element.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        $scope.image_source = event.target.result;
        $scope.$apply()
      }
      // when the file is read it triggers the onload event above.
      reader.readAsDataURL(element.files[0]);
    }

    // =========================================================================
    // =========================================================================
    // for internships
    // by default they start off with one choice
    brother.generateInternships = function(){
      brother.userData.internships = [{id: '1'}];
    }
    // generate default on start
    brother.generateInternships();

    // only add positions if the name property of the last position is not null
    brother.addNewChoice = function() {
      var newItemNo = brother.userData.internships.length+1;
      if (brother.userData.internships[brother.userData.internships.length-1].name != null){
        brother.userData.internships.push({'id':newItemNo});
      }
    };

    // if the first item is the last item, don't remove it entirely. only the name property.
    brother.removeChoice = function() {
      var lastItem = brother.userData.internships.length-1;
      if (lastItem === 0){
        delete brother.userData.internships[0].name;
      }
      else{
        brother.userData.internships.splice(lastItem);
      }
    };
  };

  // =========================================================================
  // =========================================================================
    // For minification purposes
    createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('createController', createController);

}());
