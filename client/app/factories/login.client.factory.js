angular.module('zgApp').factory('Login', ['$http', '$q', '$window',
  function($http, $q, $window) {
    var methods = {

      //========================================================================
      // authenticate the users request to login and give them a token if success
      login : function(username, password) {

        // authenticate the username and password provided
        return $http.post('/api/authenticate', {
          username: username,
          password: password
        })
        // if it was a success
        .success(function(data) {
          console.log('Data: ' + data);
          $window.localStorage.setItem('token', data.token);
          return data;
        });
      },

      //========================================================================
      // log a user out by removing the token from the browser
      logout: function() {
        $window.localStorage.removeItem('token');
      },

      //========================================================================
      // check if a user is logged in by checking for the existence of a token
      isLoggedIn: function() {
        if ($window.localStorage.getItem('token'))
          return true;
        else
          return false;
      },

      //========================================================================
      // get the current users info
      getUser: function() {
        if ($window.localStorage.getItem('token')){
          return $http.get('/api/me');
        }
        else
          return $q.reject({ message: 'No token.' });
      }
    };
    return methods;
  }
]);
