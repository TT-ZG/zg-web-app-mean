// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var createController = function($scope, $state, $stateParams, crudFactory, fileUpload){

    // =========================================================================
    // ====================Set the hardcoded form options=======================
    // =========================================================================
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

    // set default values
    brother.userData = {};
    brother.userData.available = 'Unavailable';
    brother.userData.gpa = 'On Request';
    brother.userData.standing = 'Active';

    // ==========================================================================
    // =======These functions set the response messages from the server=========
    // ==========================================================================
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

    // =========================================================================
    // ==========These functions reset form data as necessary===================
    // =========================================================================
    // reset all messages on the form
    brother.resetMessages = function(){
      brother.dataMessage = '';
      brother.pictureMessage = '';
      brother.dataError = '';
      brother.pictureError = '';
    };
    // default internships (none)
    brother.resetInternships = function(){
      brother.userData.internships = [{id: '1'}];
    };

    // =========================================================================
    // ===========These functions increase the user experience==================
    // =========================================================================
    // start the spinner on the page
    brother.startSpinner = function(){
      brother.processing = true;
    };

    // end the spinner on the page
    brother.endSpinner = function(){
      brother.processing = false;
    };

    // =========================================================================
    // ====================This function sets up the page=======================
    // =========================================================================
    // setup default values
    brother.init = function() {
      brother.startSpinner();
      brother.resetMessages();
      brother.resetInternships();
      brother.getDefaultPicture('0.jpg');
    };

    // =========================================================================
    // ====================These functions GET the initial data=================
    // =========================================================================
    // get the default picture from the database '0.jpg'
     brother.getDefaultPicture = function(pictureName){

       crudFactory.readPicture(pictureName)
        .then(function(res){
          if(res.data.success){
            $scope.image_source = "data:image/jpeg;base64, " + res.data.data;
          }
          brother.setPictureMessages(res);
        });
     };

    // =========================================================================
    // ====================These functions POST a new user to the db============
    // =========================================================================
    // create a user
    brother.saveBrother = function() {

      // reset any current errors, remove blank array rows
      brother.resetMessages();
      brother.spliceArray(brother.userData.internships);
      // create a brother
      crudFactory.create(brother.userData)
        .then(function(res){
          if(res.data.success){
            brother.uploadPicture(res.data.brotherId);
          }
          brother.setDataMessages(res);
        });
    };

    // save a brothers picture
    brother.uploadPicture = function(brotherId){
      var file = $scope.myFile;
      var method = 'POST';
      var uploadUrl = "/api/pictures/" + brotherId;
      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        // the response object is a little different here
        var res = {};
        res.data = data;
        brother.setPictureMessages(res);
        brother.endSpinner();
      });
    };

    // =========================================================================
    // ==========These functions help angular handle file objects===============
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
    // ==========These functions help handle dynamic row generation=============
    // =========================================================================
    // only add if last position is not null
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
        brother.resetInternships();
      else
        brother.userData.internships.splice(lastItem);
    };

    //chop off the last item from the array if it is blank
    brother.spliceArray = function(array){
      var lastItem = array.length-1;
      if (array[lastItem].name === undefined){
        array.splice(lastItem);
      }
    };


    // =========================================================================
    // ============================Setup the form data==========================
    // =========================================================================
    // Set up the form
    brother.init();
  };

  // ===========================================================================
  // ==========================End of controller================================
  // ===========================================================================
  // For minification purposes
  createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload'];

  // Attach the controller
  angular.module('zgApp').controller('createController', createController);

}());
