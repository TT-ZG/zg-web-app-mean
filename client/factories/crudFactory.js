// best practice: wrap in function
(function() {

    var crudFactory = function($http) {
      var methods = {

        // ***************************************
        // get all users
        get: function() {
          return $http.get('/api/brothers/');
        },
        // ***************************************
        // get a user by id
        read: function(id) {
          return $http.get('/api/brothers/' + id);
        },
        // ***************************************
        // get a users picture by id
        readPicture: function(pictureName) {
          return $http.get('/api/pictures/' + pictureName);
        },
        // ***************************************
        // create a user
        create: function(userData) {
          return $http.post('/api/brothers/', userData);
        },
        // ***************************************
        // update a user
        update: function(id, userData) {
          return $http.put('/api/brothers/' + id, userData);
        },
        // ***************************************
        // delete a user
        delete: function(id) {
          return $http.delete('/api/brothers/' + id);
        },
        // ***************************************
        // delete a picture
        deletePicture: function(pictureName) {
          return $http.delete('/api/pictures/' + pictureName);
        }
      };
      return methods;
    };

    // Inject this way for minification
    crudFactory.$inject = ['$http'];

    //Attach to app
    angular.module('zgApp').factory('crudFactory', crudFactory);

}());
