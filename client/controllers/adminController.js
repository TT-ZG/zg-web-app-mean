// best practice: wrap in function
(function() {

  // this controller handles admin features
  var adminController = function($state, $stateParams, crudFactory){
    var admin = this;

    // *************************************************************************
    // start the spinner on the page
    admin.startSpinner = function(){
      admin.processing = true;
    };
    // end the spinner on the page
    admin.endSpinner = function(){
      admin.processing = false;
    };

    // *************************************************************************
    // initializes the data table
    admin.init = function() {
      crudFactory.get().then(function(res){
          if (res.data.success)
            admin.brothers = res.data.info;
          console.log(res.data.message);
        });
    };
    admin.init();

    // *************************************************************************
    // delete a brothers information totally
    admin.delete = function(id, pictureName) {
      // delete a brothers info by id
      admin.startSpinner();
      crudFactory.delete(id).then(function(res){
          console.log(res.data.message);
        });
      // delete a brothers picture by pictureName
      crudFactory.deletePicture(pictureName).then(function(res){
        console.log(res.data.message);
      });
      // refresh the data
      admin.init();
    };

    // *************************************************************************
    // delete a brothers current picture then reset it to the default
    admin.resetPicture = function(brotherId, pictureName){

      // delete a brothers picture by pictureName
      crudFactory.deletePicture(pictureName).then(function(res){
        console.log(res.data.message);
      });

      // reset the picture to default, refresh the table
      admin.userData = {picture: '0.jpg'};
      crudFactory.update(brotherId, admin.userData).then(function(res){
        console.log(res.data.message);
        admin.init();
      });
    };

    // *************************************************************************
    // set the id in scope because uirouter doesn't accept angular exp as parameters
    admin.setID = function(id){
      admin.desiredID = id;
    };
  };

  // *************************************************************************
  // inject this way for minification purposes
  adminController.$inject = ['$state', '$stateParams', 'crudFactory'];

  // attach controller
  angular.module('zgApp').controller('adminController', adminController);
}());
