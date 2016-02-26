angular.module('zgApp')

// =============================================================================
// =============================================================================
.factory('Crud', ['$http',
  function($http) {
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
      }
    };
    return methods;
  }
]);
