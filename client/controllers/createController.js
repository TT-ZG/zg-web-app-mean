// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var createController = function($scope, $state, $stateParams, crudFactory, fileUpload, items){

    // *************************************************************************
    // hardcoded form options
    var brother = this;
    brother.standings   = items.getStandings();
    brother.availables  = items.getAvailables();
    brother.gpas        = items.getGpas();

    // *************************************************************************
    // set the server response messages for the discrete json messages
    brother.setDataMessages = function(res){
      if(res.data.success){
        console.log('Success:' + res.data.message);
      }
      else{
        console.log('Error:' + res.data.message);
      }
      brother.dataMessage = res.data.message;
    };

    // set the server response messages for the picture messages
    brother.setPictureMessages = function(res){
      if(res.data.success){
        console.log('Success:' + res.data.message);
      }
      else{
        console.log('Error:' + res.data.message);
      }
      brother.pictureMessage = res.data.message;
    };

    // *************************************************************************
    // reset all messages on the form
    brother.resetMessages = function(){
      brother.dataMessage = '';
      brother.pictureMessage = '';
    };
    // default internships (none)
    brother.resetInternships = function(){
      brother.userData.internships = [{id:1, name:''}];
    };

    // *************************************************************************
    // start the spinner on the page
    brother.startSpinner = function(){
      brother.processing = true;
    };

    // end the spinner on the page
    brother.endSpinner = function(){
      brother.processing = false;
    };

    // *************************************************************************
    // setup default values
    brother.init = function() {
      brother.userData = items.getDefault();
      brother.startSpinner();
      brother.resetMessages();
      //brother.resetInternships();

      crudFactory.readPicture('0.jpg').then(function(res){
         if(res.data.success){
           $scope.image_source = "data:image/jpeg;base64, " + res.data.data;
         }
         brother.setPictureMessages(res);
         brother.endSpinner();
       });
    };
    brother.init();

    // *************************************************************************
    // create a user
    brother.saveBrother = function() {

      // reset any current errors, remove blank array rows
      brother.startSpinner();
      brother.resetMessages();
      brother.spliceArray(brother.userData.internships);

      // create a brother
      crudFactory.create(brother.userData).then(function(res){
        if(res.data.success){
          brother.uploadPicture(res.data.brotherId);
        } else{
          brother.endSpinner();
        }
        brother.setDataMessages(res);
        //brother.resetInternships();
      });
    };

    // *************************************************************************
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

    // *************************************************************************
    // for image preview
    $scope.setFile = function(element) {
      $scope.currentFile = element.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        $scope.image_source = event.target.result;
        $scope.$apply();
      };
      // when the file is read it triggers the onload event above.
      reader.readAsDataURL(element.files[0]);
    };

    // *************************************************************************
    // only add if last position is not null
    brother.addNewChoice = function() {
      var length = brother.userData.internships.length;

      if(brother.userData.internships[length-1].name){
        brother.userData.internships.push({id : length+1, name : ''});
      } else{
        console.log('Cannot add more until the last is filled.');
      }

    };

    // if the first item is the last item, simply do the default
    brother.removeChoice = function() {
      var length = brother.userData.internships.length;

      if (length-1 === 0)
        brother.resetInternships();
      else
        brother.userData.internships.splice(length-1);
    };

    //chop off the last item from the array if it is blank
    brother.spliceArray = function(array){
      var length = array.length;

      if (!array[length-1].name && length-1!==0){
        array.splice(length-1);
      }
    };
  };

  // ===========================================================================
  // ==========================End of controller================================
  // ===========================================================================
  // For minification purposes
  createController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload', 'items'];

  // Attach the controller
  angular.module('zgApp').controller('createController', createController);

}());
