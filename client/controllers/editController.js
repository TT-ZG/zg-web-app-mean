// best practice: wrap in function
(function() {

  // this controller handles the editing of brothers
  var editController = function($state, $stateParams, crudFactory, $scope, fileUpload){

    // =========================================================================
    // =========================================================================
    // better to use 'controller as' rather than brother
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

    // =========================================================================
    // =========================================================================
    // call a service to get a specific user
    crudFactory.read($stateParams.brotherid).success(function(data) {

      // get the information for this id
      brother.userData = data;
      // angular doesn't like the default date object
      brother.userData.graduation = new Date(brother.userData.graduation);
      // get the users picture
      brother.readPicture(brother.userData.picture);
    });

    // ***************************************
    // call a service to get a specific users picture
     brother.readPicture = function(pictureName){

       crudFactory.readPicture(pictureName).success(function(data) {


         brother.theImage = data


       });


     }


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
  };





    // ***************************************
    // For minification purposes
    editController.$inject = ['$state', '$stateParams', 'crudFactory', '$scope', 'fileUpload'];
    // Attach the controller
    angular.module('zgApp').controller('editController', editController);

}());
