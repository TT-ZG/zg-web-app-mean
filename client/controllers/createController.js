// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var createController = function($scope, $state, $stateParams, crudFactory, fileUpload){
    var brother = this;

    // =========================================================================
    // ==========================SETUP FUNCTIONS================================
    // =========================================================================

    // *********************************
    // *********************************
    // setup default values
    brother.init = function() {

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

      // set default values
      brother.userData = {};
      brother.userData.available = 'Unavailable';
      brother.userData.gpa = 'On Request';
      brother.userData.standing = 'Active';

      // set a spinner, generate lists, get default picture
      brother.resetErrors();
      brother.generateInternships();
      brother.getDefaultPicture('0.jpg');
    };

    // *********************************
    // *********************************
    // reset errors
    brother.resetErrors = function(){
      brother.processing = true;
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.dataError = '';
      brother.pictureError = '';
    };

    // *********************************
    // *********************************
    // set error messages
    brother.setErrors = function(picture, data){

      if(picture!== undefined){
        brother.pictureMessage = '';
        brother.pictureError = '';
        if(picture.success){
          console.log('Success:' + picture.message);
          brother.pictureMessage = picture.message;
          brother.pictureError = '';
        }
        else{
          console.log('Error:' + picture.message);
          brother.pictureError = picture.message;
          brother.pictureMessage = '';
        }
      }
      if(data!== undefined){
        brother.dataMessage = '';
        brother.dataError = '';
        // if we shaved off the example because they entered nothing, reset
        if (brother.userData.internships.length === 0){
          brother.generateInternships();
        }

        if(data.success){
          console.log('Success:' + data.message);
          brother.dataMessage = data.message;
          brother.dataError = '';
        }
        else{
          console.log('Error:' + data.message);
          brother.dataError = data.message;
          brother.dataMessage = '';
        }
      }
      brother.processing = false;
    }


    // =========================================================================
    // ==========================MAIN FUNCTIONS=================================
    // =========================================================================

    // *************************************
    // *************************************
    // get a specific users picture
     brother.getDefaultPicture = function(pictureName){

       // reset any current errors
       brother.resetErrors();

       // get a picture based on the name (picturenames are unique)
       crudFactory.readPicture(pictureName)
       .success(function(res){
         $scope.image_source = "data:image/jpeg;base64, " + res.data;
         brother.setErrors(res, undefined);
       })
       .error(function(res){
         brother.setErrors(res, undefined);
       });
     };

    // *************************************
    // *************************************
    // create a user
    brother.saveBrother = function() {

      // reset any current errors, remove blank array rows
      brother.resetErrors();
      brother.spliceArray(brother.userData.internships);

      // create a brother
      crudFactory.create(brother.userData)
      .success(function(res){
        brother.setErrors(undefined, res);
        brother.uploadPicture(res.brotherId);
      })
      .error(function(res){
        brother.setErrors(undefined, res);
      });
    };

    // *************************************
    // *************************************
    // upload a brothers picture
    brother.uploadPicture = function(brotherId){
      var file = $scope.myFile;
      var method = 'POST';
      var uploadUrl = "/api/pictures/" + brotherId;
      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        brother.setErrors(data, undefined);
      });
    };

    //==========================================================================
    // ========================HELPER FUNCTIONS=================================
    // =========================================================================

    // *********************************
    // *********************************
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

    // *********************************
    // *********************************
    // by default they start off with one choice
    brother.generateInternships = function(){
      brother.userData.internships = [{id: '1'}];
    }
    // only add positions if the name property of the last position is not null
    brother.addNewChoice = function() {
      var newItemNo = brother.userData.internships.length+1;
      if (brother.userData.internships[brother.userData.internships.length-1].name != null){
        brother.userData.internships.push({'id':newItemNo});
      }
    };

    // *********************************
    // *********************************
    // if the first item is the last item, don't remove it entirely. only the name property.
    brother.removeChoice = function() {
      var lastItem = brother.userData.internships.length-1;
      if (lastItem === 0)
        brother.generateInternships();
      else
        brother.userData.internships.splice(lastItem);
    };

    // *********************************
    // *********************************
    //chop off the last item from the array if it is blank
    brother.spliceArray = function(array){
      var lastItem = array.length-1;
      if (array[lastItem].name === undefined){
        array.splice(lastItem);
      }
    };

    // *********************************
    // *********************************
    // Set up the form
    brother.init();
  };

  // =========================================================================
  // =========================================================================
    // For minification purposes
    createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('createController', createController);

}());
