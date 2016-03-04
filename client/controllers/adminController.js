// best practice: wrap in function
(function() {

  // this controller handles admin features
  var adminController = function($state, $stateParams, crudFactory){

    // =========================================================================
    // =========================================================================
    // set data
    var admin = this;       // better to use 'controller as' rather than $scope

    // =========================================================================
    // =========================================================================
    admin.init = function() {
      crudFactory.get()
      .success(function(brothers){
        if (brothers.success){
          admin.brothers = brothers.info;
        }
      })
      .error(function(res){
        console.log ('Uncaught error: ' + admin.message);
      });
    };
    admin.init(); // initialize brothers

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
      // delete the brother by id
      crudFactory.delete(id)
      .success(function(res){
        if (res.success){
          console.log (res.message);
        }
      })
      .error(function(res){
        console.log ('Uncaught error: ' + res.message);
      });
    };
    // =========================================================================
    // =========================================================================
    // delete a brothers picture
    admin.deletePicture = function(pictureName){
      // delete the picture by pictureName
      crudFactory.deletePicture(pictureName)
      .success(function(res){
        if (res.success){
          console.log (res.message);
        }
      })
      .error(function(res){
        console.log ('Uncaught error: ' + res.message);
      });
    };
};

  // =========================================================================
  // =========================================================================
  // inject this way for minification purposes
  adminController.$inject = ['$state', '$stateParams', 'crudFactory'];
  angular.module('zgApp').controller('adminController', adminController);
}());
