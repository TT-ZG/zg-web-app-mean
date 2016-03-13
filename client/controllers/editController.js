// best practice: wrap in function
(function() {

  // this controller handles the editing of brothers
  var editController = function($state, $stateParams, crudFactory, $scope, fileUpload){

   // =============Here are setting the hardcoded form options==================
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


    // =========These functions get the brothers info from the server===========
    // get a brothers info
    brother.get = function(id){

      brother.resetMessages();
      brother.startSpinner();
      // get info by id
      crudFactory.read(id)
        .then(function(res){
          if (res.data.success){
            brother.setInfo(res);
            brother.readPicture(brother.userData.picture);
          }
          brother.setDataMessages(res);
        });
    };
    // get a brothers picture
    brother.readPicture = function(pictureName){
      crudFactory.readPicture(pictureName)
        .then(function(res){
          if (res.data.success){
            brother.setPicture(res);
            brother.setPictureMessages(res);
          }
          brother.setPictureMessages(res);
          brother.endSpinner();
        });
     };

     // ==========These functions set the brothers info from the server==========
     // set the discrete json data
     brother.setInfo = function(res){
       brother.userData = res.data.info;
       brother.userData.graduation = new Date(brother.userData.graduation);
       brother.setInternships();
     }
     // set the base 64 encoded image
     brother.setPicture = function(res){
       $scope.image_source = "data:image/jpeg;base64, " + res.data.data;
     }
     // set the dynamic rows for the internships
     brother.setInternships = function(){
       // if we shaved off the example because they entered nothing, reset
       if (brother.userData.internships.length === 0){
         brother.generateInternships();
       }
     };

     // =======These functions set the response messages from the server=========
     // set the server response messages for the discrete json messages
     brother.setDataMessages = function(res){
       if(res.data.success){
         console.log('Success:' + res.data.message);
         brother.dataMessage = res.data.message;
         brother.dataError = '';
       }
       else{
         console.log('Error:' + res.data.message);
         brother.dataError = res.data.message;
         brother.dataMessage = '';
       }
     };
     // set the server response messages for the picture
     brother.setPictureMessages = function(res){
       if(res.data.success){
         console.log('Success:' + res.data.message);
         brother.pictureMessage = res.data.message;
         brother.pictureError = '';
       }
       else{
         console.log('Error:' + res.data.message);
         brother.pictureError = res.data.message;
         brother.pictureMessage = '';
       }
     };
     // reset all messages on the form
     brother.resetMessages = function(){
       brother.dataMessage = '';
       brother.pictureMessage = '';
       brother.dataError = '';
       brother.pictureError = '';
     };

     // ===========These functions increase the user experience=================
     // start the spinner on the page
     brother.startSpinner = function(){
       brother.processing = true;
     };
     // end the spinner on the page
     brother.endSpinner = function(){
       brother.processing = false;
     };




















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
    brother.get($stateParams.brotherid);
  };

  // =========================================================================
  // =========================================================================
  // For minification purposes
  editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];

  // Attach the controller
  angular.module('zgApp').controller('editController', editController);

}());
