angular.module('zgApp').factory('Interceptor', ['$location', '$q', '$injector', '$window',
  function($location, $q, $injector, $window) {
    var methods = {

      //========================================================================
      // intercept http reqests before they happen
      request : function(config) {

        // grab the token
    		var token = $window.localStorage.getItem('token');

    		// if the token exists, add it to the header as x-access-token
    		if (token) config.headers['x-access-token'] = token;

    		return config;
      },

      //========================================================================
      // response errors
      responseError : function(response) {
        
        // if our server returns a 403 forbidden response
        if (response.status == 403) {
          $window.localStorage.removeItem('token');
          $injector.get('$state').transitionTo('visitors.home');
        }

        // return the errors from the server as a promise
        return $q.reject(response);
      }
    };
    return methods;
  }
]);
