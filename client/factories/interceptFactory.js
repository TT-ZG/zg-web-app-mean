// best practice: wrap in function
(function() {
    var interceptFactory = function($location, $q, $injector, $window) {
      var methods = {

        // ***************************************
        // intercept http reqests before they happen
        request : function(config) {

          var token = $window.localStorage.getItem('token');
          // if the token exists, add it to the header as x-access-token
          if (token){
            config.headers['x-access-token'] = token;
          }

          return config;
        },

        // ***************************************
        // response errors
        responseError : function(response) {

          // if our server returns a 401 unauthorized response
          if (response.status == 401) {
            $window.localStorage.removeItem('token');
          }

          // if our server returns a 403 forbidden response
          if (response.status == 403) {
            $window.localStorage.removeItem('token');
            $injector.get('$state').transitionTo('main.home');
          }

          // ***************************************
          return $q.reject(response);
        }
      };
      return methods;
    };

    // Inject this way for minification
    interceptFactory.$inject = ['$location', '$q', '$injector', '$window'];

    //Attach to app
    angular.module('zgApp').factory('interceptFactory', interceptFactory);

}());
