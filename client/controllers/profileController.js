// best practice: wrap in function
(function() {

  // this controller handles the creation of brothers
  var profileController = function($scope, $state, $stateParams, crudFactory, fileUpload, items, profile){

    // *************************************************************************
    // hardcoded form options
    var brother = this;
    brother.standings   = items.getStandings();
    brother.availables  = items.getAvailables();
    brother.gpas        = items.getGpas();
    brother.userData    = {};
    // *************************************************************************
    // these functions are helper functions

    // reset all messages on the form
    brother.resetMessages = function(){
      brother.dataMessage = '';
      brother.pictureMessage = '';
    };
    // default internships (none)
    brother.resetInternships = function(){
      brother.userData.internships = [{id:1, name:''}];
    };
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
      console.log('State: ' + $state.current.name);
      brother.startSpinner();
      brother.resetMessages();

      if ($state.current.name === 'main.create'){
        brother.userData = items.getDefault();
        brother.readPicture('0.jpg');
      }
      else if ($state.current.name === 'main.edit' || $state.current.name === 'main.profile'){
        brother.readBrother($stateParams.brotherid);
      }
    };

    // *************************************************************************
    // these functions are for editing

    // get a brother by their id
    brother.readBrother = function(id){
      crudFactory.read(id).then(function(res){
        if (res.data.success){
          brother.userData = res.data.info;
          brother.userData.graduation = new Date(brother.userData.graduation);
          brother.readPicture(brother.userData.picture);
        }
        brother.dataMessage = profile.setMessages(res);
      });
    };

    brother.putBrother = function(){
      brother.resetMessages();
      brother.startSpinner();
      brother.spliceArray(brother.userData.internships);

      // update the brothers info
      crudFactory.update($stateParams.brotherid, brother.userData).then(function(res){
          if (res.data.success){
            brother.uploadPicture($stateParams.brotherid, 'PUT');
          }
          brother.dataMessage = profile.setMessages(res);
        });
    }

    // *************************************************************************
    // these functions are for creating

    // post a new brother to the database
    brother.postBrother = function(){
      // reset any current errors, remove blank array rows
      brother.startSpinner();
      brother.resetMessages();
      brother.spliceArray(brother.userData.internships);

      // create a brother
      crudFactory.create(brother.userData).then(function(res){
        if(res.data.success){
          brother.uploadPicture(res.data.brotherId, 'POST');
        } else{
          brother.endSpinner();
        }
        brother.dataMessage = profile.setMessages(res);
      });
    }


    // *************************************************************************
    // these functions are shared between editing and creating

    // save a brothers info
    brother.saveBrother = function() {
      if ($state.current.name === 'main.create'){
        brother.postBrother();
      }
      else if ($state.current.name === 'main.edit' || $state.current.name === 'main.profile'){
        brother.putBrother();
      }
    };

    // get a brothers picture
    brother.readPicture = function(pictureName){
      console.log(pictureName);
      crudFactory.readPicture(pictureName).then(function(res){
        if (res.data.success){
          $scope.image_source = "data:image/jpeg;base64, " + res.data.data;
        }
        brother.pictureMessage = profile.setMessages(res);
        brother.endSpinner();
      });
    };

    // save a brothers picture
    brother.uploadPicture = function(brotherId, method){
      var file = $scope.myFile || $scope.currentFile;
      var uploadUrl = "/api/pictures/" + brotherId;
      // save the brothers picture using special service
      fileUpload.upload(method, file, uploadUrl, function(data, status, headers, config){
        // the response object is a little different here
        var res = {};
        res.data = data;
        brother.pictureMessage = profile.setMessages(res);
        brother.endSpinner();
        if ($state.current.name === 'main.create'){
          brother.userData = '';
        }
      });
    };



    // *************************************************************************
    // these functions help angular handle images

    // for image preview
    $scope.setFile = function(element) {
      $scope.currentFile = element.files[0];
      var reader = new FileReader();

      reader.onload = function(event) {
        $scope.image_source = event.target.result;
        $scope.$apply();
      };
      // when the file is read it triggers the onload event above.
      if ($scope.currentFile && $scope.currentFile.type.match('image.*')) {
        console.log('File type OK.');
        reader.readAsDataURL(element.files[0]);
      } else{
        console.log('File type not supported.');
      }
    };

    // *************************************************************************
    // these functions help dynamic row generation on the form

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

    // *************************************************************************
    // initialize the data
    brother.init();
  };

    // *************************************************************************
  // For minification purposes
  profileController.$inject = ['$scope', '$state', '$stateParams', 'crudFactory', 'fileUpload', 'items', 'profile'];

  // Attach the controller
  angular.module('zgApp').controller('profileController', profileController);

}());
