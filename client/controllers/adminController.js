// best practice: wrap in function
(function() {

  // this controller handles admin features
  var adminController = function($state, $stateParams, crudFactory){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than $scope
    var admin = this;

    // =========================================================================
    // =========================================================================
    // initialize brothers
    admin.init = function() {
      crudFactory.get()
      .then(function(res){
        if (res.data.success)
          admin.brothers = res.data.info;
        console.log(res.data.message);
      })
    };
    admin.init();

    // =========================================================================
    // =========================================================================
    // set the id in scope because uirouter doesn't accept angular exp as parameters
    admin.setID = function(id){
      admin.desiredID = id;
    };

    // =========================================================================
    // =========================================================================
    // delete a brothers information totally
    admin.delete = function(id, pictureName) {
      admin.deleteBrother(id);
      admin.deletePicture(pictureName);
      admin.init();
    };

    // =========================================================================
    // =========================================================================
    // delete a brothers info by id
    admin.deleteBrother = function(id){
      crudFactory.delete(id)
      .then(function(res){
        console.log(res.data.message);
      });
    };
    // =========================================================================
    // =========================================================================
    // delete a brothers picture
    admin.deletePicture = function(pictureName){
      // delete the picture by pictureName
      crudFactory.deletePicture(pictureName)
      .then(function(res){
        console.log(res.data.message);
      });
    };

    // =========================================================================
    // =========================================================================
    // delete a brothers picture
    admin.resetPicture = function(brotherId, pictureName){

      // delete the current picture from the database
      admin.deletePicture(pictureName);

      // reset the picture to default
      admin.userData = {};
      admin.userData.picture = '0.jpg';
      crudFactory.update(brotherId, admin.userData)
      .then(function(res){
        console.log(res.data.message);
        admin.init();
      });
    };
};

  // =========================================================================
  // =========================================================================
  // inject this way for minification purposes
  adminController.$inject = ['$state', '$stateParams', 'crudFactory'];
  angular.module('zgApp').controller('adminController', adminController);
}());
