// best practice: wrap in function
(function() {
    var authFactory = function($http, $q, $window) {
      var methods = {

        // ***************************************
        // authenticate the users request to login and give them a token if success
        login : function(username, password) {

          // authenticate the username and password provided
          return $http.post('/api/authenticate', {
            username: username,
            password: password
          });
        },

        // ***************************************
        // log a user out by removing the token from the browser
        logout : function() {
          $window.localStorage.removeItem('token');
        },

        // ***************************************
        // check if a user is logged in by checking for the existence of a token
        isLoggedIn : function() {
          if ($window.localStorage.getItem('token'))
            return true;
          else
            return false;
        },

        // ***************************************
        // get the current users info
        getUser : function(){
          return $http.get('/api/me');
        }
      };
      return methods;
    };

    // Inject this way for minification
    authFactory.$inject = ['$http', '$q', '$window'];

    //Attach to app
    angular.module('zgApp').factory('authFactory', authFactory);

}());
