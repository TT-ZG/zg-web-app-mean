// best practice: wrap in function
(function() {

    var adminController = function($state, $stateParams, crudFactory){

      // ***************************************
      // set data
      var admin = this;       // better to use 'controller as' rather than $scope

      // ***************************************
      // get all brothers
      crudFactory.get().success(function(data) {
        admin.brothers = data;
      });

      // ***************************************
      // set the id in scope because uirouter doesn't accept angular exp as parameters
      admin.setID = function(id){
        admin.desiredID = id;
      };

      // ***************************************
      // delete a brother
      admin.deleteBrother = function(id) {
        crudFactory.delete(id).success(function(data) {
            // get all users to update the table
            crudFactory.get().success(function(data) {
                admin.brothers = data;
              });
          });
      };
    };

    adminController.$inject = ['$state', '$stateParams', 'crudFactory'];

    angular.module('zgApp').controller('adminController', adminController);

}());
