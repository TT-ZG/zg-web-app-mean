// best practice: wrap in function
(function() {

    var editController = function($state, $stateParams, crudFactory){
      // better to use 'controller as' rather than $scope
      var brother = this;

      // variable to determine if we should hide/show elements of the view
      brother.type = 'edit';

      //===========================================
      // call a service to get a specific user
      crudFactory.read($stateParams.brotherid).success(function(data) {
          brother.userData = data;
        });

      //===========================================
      // call a service to edit a specific user
      brother.saveBrother = function() {
        brother.message = '';

        crudFactory.update($stateParams.brotherid, brother.userData).success(function(data) {
            brother.userData = {};
            brother.message = data.message;
          });
      };
    };

    editController.$inject = ['$state', '$stateParams', 'crudFactory'];

    angular.module('zgApp').controller('editController', editController);

}());
