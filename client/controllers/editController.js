// best practice: wrap in function
(function() {

  // this controller handles the editing of brothers
  var editController = function($state, $stateParams, crudFactory, $scope, fileUpload){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than brother
    var brother = this;

    // =========================================================================
    // =========================================================================
    // get a specific users information
    brother.init = function() {
      // set a spinner while we are fetching the data, clear, messages
      brother.processing = true;
      brother.dataMessage = '';
      brother.pictureMessage = '';

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

      // get brother
      brother.get($stateParams.brotherid);
    };

    // =========================================================================
    // =========================================================================
    // get a brothers info
    brother.get = function(id){

      // get info by id
      crudFactory.read(id)
      .success(function(res){
        if (res.success){
          // show the returned messages, save the brothers info
          brother.userData = res.info;
          brother.dataMessage = res.message;
          // angular doesn't like the returned date, we need to set it this way
          brother.userData.graduation = new Date(brother.userData.graduation);
          // if they have no internships
          if (brother.userData.internships.length === 0)
            brother.generateInternships();
          // get the brothers picture given their picture name
          brother.readPicture(brother.userData.picture);
        }
        console.log (res.message);
      })
      .error(function(res){
        console.log (res.message);
      })
    };

    // =========================================================================
    // =========================================================================
    // call a service to get a specific users picture
     brother.readPicture = function(pictureName){
       crudFactory.readPicture(pictureName)
       .success(function(res){
         if (res.success){
           brother.pictureMessage = res.message;
           // encode base64 image data into html this way
           $scope.image_source = "data:image/jpeg;base64, " + res.data;
           brother.processing = false;
         }
        console.log (res.message);
       })
       .error(function(res){
         console.log (res.message);
       });
     }

    // =========================================================================
    // =========================================================================
    // edit a specific user
    brother.saveBrother = function() {
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.processing = true;

      //chop off the last item from the array if it is blank
      var lastItem = brother.userData.internships.length-1;
      if (brother.userData.internships[lastItem].name === undefined){
        brother.userData.internships.splice(lastItem);
      }

      // update the brothers info
      crudFactory.update($stateParams.brotherid, brother.userData)
      .success(function(res){
        if (res.success){
          brother.dataMessage = res.message;
          brother.updatePicture($stateParams.brotherid);
          // if we chopped off the last internship
          if (brother.userData.internships.length === 0)
            brother.generateInternships();
        }
        console.log(res.message);
      })
      .error(function(res){
        console.log(res.message);
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
      var uploadUrl = "/api/pictures/" + brotherId;

      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        console.log(data.message);
        brother.pictureMessage = data.message;
        brother.processing = false;
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
      if (lastItem === 0)
        brother.generateInternships();
      else
        brother.userData.internships.splice(lastItem);
    };

    // =========================================================================
    // =========================================================================
    // get the data when the state is loaded
    brother.init();
  };

  // =========================================================================
  // =========================================================================
  // For minification purposes
  editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];

  // Attach the controller
  angular.module('zgApp').controller('editController', editController);

}());
