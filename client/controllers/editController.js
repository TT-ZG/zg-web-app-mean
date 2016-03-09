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
      // set a spinner while we are fetching the data
      brother.processing = true;
      // clear messages
      brother.dataMessage = '';
      brother.pictureMessage = '';
      // get a brother given the id in the URL
      brother.get($stateParams.brotherid);
    };

    // =========================================================================
    // =========================================================================
    // get a brothers info
    brother.get = function(id){

      crudFactory.read(id)
      .success(function(res){
        if (res.success){
          // log the message
          console.log(res.message);
          // show the returned messages
          brother.userData = res.info;
          brother.dataMessage = res.message;
          // angular doesn't like the returned date, we need to set it this way
          brother.userData.graduation = new Date(brother.userData.graduation);
          // if they have no internships
          if (brother.userData.internships.length === 0){
            brother.generateInternships();
          }
          // get the brothers picture given their picture name
          brother.readPicture(brother.userData.picture);
        }
      })
      .error(function(res){
        // log the message
        console.log (res.message);
      });
    };

    // =========================================================================
    // =========================================================================
    // call a service to get a specific users picture
     brother.readPicture = function(pictureName){
       crudFactory.readPicture(pictureName)
       .success(function(res) {
         // log the message
         console.log(res.message);
         // set the picture
         brother.pictureMessage = res.message;
         // encode base64 image data this way
         $scope.image_source = "data:image/jpeg;base64, " + res.data;
         // end the spinner
         brother.processing = false;
       })
       .error(function(res){
         // show the message
         console.log (res.message);
         // end the spinner
         brother.processing = false;
       });
     }

    // =========================================================================
    // =========================================================================
    // edit a specific user
    brother.saveBrother = function() {
      //clear the error messages
      brother.dataMessage = '';
      brother.pictureMessage = '';
      // update the brother
      brother.updateBrother($stateParams.brotherid, brother.userData);
    };

    // =========================================================================
    // =========================================================================
    // for updating a brother's information
    brother.updateBrother = function(id, info){

      //chop off the last item from the array if it is blank
      var lastItem = brother.userData.internships.length-1;
      if (brother.userData.internships[lastItem].name === undefined){
        brother.userData.internships.splice(lastItem);
      }

      // update the brothers info
      crudFactory.update(id, info)
      .success(function(res) {
        // log the message
        console.log(res.message)
        // show the returned message
        brother.dataMessage = res.message;
        // update the brothers picture given the brothers id
        brother.updatePicture(id);
        // if we chopped off the last internship
        if (brother.userData.internships.length === 0){
          brother.generateInternships();
        }
      })
      .error(function(res){
        // log the message
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
      // set the format in which we update the picture
      var method = 'PUT';
      //console.dir(file);

      var uploadUrl = "/api/pictures/" + brotherId;

      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        // log the message
        console.log(data.message);
        // set the picture
        brother.pictureMessage = data.message;
      });
    };

    // =========================================================================
    // =========================================================================
    // default internships (none)
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

    // if the first item is the last item, simply do the default
    brother.removeChoice = function() {
      var lastItem = brother.userData.internships.length-1;

      // if the first item is the last item, simply set it to the default
      if (lastItem === 0){
        brother.generateInternships();
      }
      // else, remove the last item entirely
      else{
        brother.userData.internships.splice(lastItem);
      }
    };

    // get the data when the state is loaded
    brother.init();
  };

    // ***************************************
    // For minification purposes
    editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('editController', editController);

}());
