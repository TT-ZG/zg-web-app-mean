// best practice: wrap in function
(function() {

  var editController = function($state, $stateParams, crudFactory, $scope, fileUpload){

    // ***************************************
    // better to use 'controller as' rather than brother
    var brother = this;

    // variable to determine if we should hide/show elements of the view
    brother.type = 'edit';

    // ***************************************
    // call a service to get a specific user
    crudFactory.read($stateParams.brotherid).success(function(data) {

      // get the information for this id
      brother.userData = data;

      // angular doesn't like the default date object
      brother.userData.graduation = new Date(brother.userData.graduation);
    });

    // ***************************************
    // call a service to edit a specific user
    brother.saveBrother = function() {

      //clear the error message
      brother.message = '';

      crudFactory.update($stateParams.brotherid, brother.userData).success(function(data) {
        brother.userData = {};
        brother.message = data.message;
      });
    };

    // ***************************************






  };

    // ***************************************
    // For minification purposes
    editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('editController', editController);

}());
