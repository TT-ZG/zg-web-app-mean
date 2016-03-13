// best practice: wrap in function
(function() {

  // this controller handles admin features
  var adminController = function($state, $stateParams, crudFactory){
    var admin = this;

    // =========================================================================
    // ==========================SETUP FUNCTIONS================================
    // =========================================================================

    // *********************************
    // *********************************
    // initialize brothers
    admin.init = function() {
      crudFactory.get()
      .success(function(res){
        if (res.success)
          admin.brothers = res.info;
        console.log(res.message);
      })
      .error(function(res){
        console.log(res.message);
      });
    };
    admin.init();


    // =========================================================================
    // ==========================MAIN FUNCTIONS=================================
    // =========================================================================

    // *********************************
    // *********************************
    // delete a brothers information totally
    admin.delete = function(id, pictureName) {
      admin.deleteBrother(id);
      admin.deletePicture(pictureName);
      admin.init();
    };

    // *********************************
    // *********************************
    // delete a brothers info by id
    admin.deleteBrother = function(id){
      crudFactory.delete(id)
      .success(function(res){
        console.log(res.message);
      })
      .error(function(res){
        console.log(res.message);
      });
    };

    // *********************************
    // *********************************
    // delete a brothers picture
    admin.deletePicture = function(pictureName){
      // delete the picture by pictureName
      crudFactory.deletePicture(pictureName)
      .success(function(res){
        console.log(res.message);
      })
      .error(function(res){
        console.log(res.message);
      });
    };

    // *********************************
    // *********************************
    // delete a brothers picture
    admin.resetPicture = function(brotherId, pictureName){

      // delete the current picture from the database
      admin.deletePicture(pictureName);

      // reset the picture to default
      admin.userData = {};
      admin.userData.picture = '0.jpg';
      crudFactory.update(brotherId, admin.userData)
      .success(function(res){
        console.log(res.message);
        admin.init();
      })
      .error(function(res){
        console.log(res.message);
        admin.init();
      });
    };


    //==========================================================================
    // ========================HELPER FUNCTIONS=================================
    // =========================================================================

    // *********************************
    // *********************************
    // set the id in scope because uirouter doesn't accept angular exp as parameters
    admin.setID = function(id){
      admin.desiredID = id;
    };
  };

  // ===========================================================================
  // ==========================ATTACH TO APP====================================
  // ===========================================================================
  // inject this way for minification purposes
  adminController.$inject = ['$state', '$stateParams', 'crudFactory'];

  // attach controller
  angular.module('zgApp').controller('adminController', adminController);
}());
