// best practice: wrap in function
(function() {

  // this controller handles the editing of brothers
  var editController = function($state, $stateParams, crudFactory, $scope, fileUpload){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than brother
    var brother = this;

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
    // get a specific users information
    brother.init = function() {
      brother.processing = true;
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.get($stateParams.brotherid);
    };

    // =========================================================================
    // =========================================================================
    // get a brothers info
    brother.get = function(id){

      crudFactory.read(id)
      .success(function(res){
        if (res.success){
          console.log(res.message);
          brother.userData = res.info;
          brother.dataMessage = res.message;
          brother.userData.graduation = new Date(brother.userData.graduation);
          // get the picture now
          brother.readPicture(brother.userData.picture);
        }
      })
      .error(function(res){
        console.log (res.message);
      });
    };

    // =========================================================================
    // =========================================================================
    // call a service to get a specific users picture
     brother.readPicture = function(pictureName){
       crudFactory.readPicture(pictureName)
       .success(function(res) {
         console.log(res.message);
         brother.pictureMessage = res.message;
         $scope.image_source = "data:image/jpeg;base64, " + res.data;
         brother.processing = false;
       })
       .error(function(res){
         console.log (res.message);
         brother.processing = false;
       });
     }

    // =========================================================================
    // =========================================================================
    // edit a specific user
    brother.saveBrother = function() {
      //clear the error messages, call the necessary functions
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.updateBrother($stateParams.brotherid, brother.userData);
    };

    // =========================================================================
    // =========================================================================
    // for updating a brother's information
    brother.updateBrother = function(id, info){
      // update the brothers info
      crudFactory.update(id, info)
      .success(function(res) {
        console.log(res.message)
        brother.dataMessage = res.message;
        brother.updatePicture(id);
      })
      .error(function(res){
        console.log(res.message)
      })
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
    brother.updatePicture = function(brotherId){
      var file = $scope.myFile;
      var method = 'PUT';
      //console.dir(file);

      var uploadUrl = "/api/pictures/" + brotherId;

      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        console.log(data.message);
        brother.pictureMessage = data.message;
      });
    };

    // get the data
    brother.init();
  };

    // ***************************************
    // For minification purposes
    editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('editController', editController);

}());
