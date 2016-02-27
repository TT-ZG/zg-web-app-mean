// best practice: wrap in function
(function() {

    var mainController = function($state, $rootScope, authFactory, crudFactory){

      // ***************************************
      // set data
    	var main          = this;                     // better to use 'controller as' rather than $scope
    	main.loggedIn     = authFactory.isLoggedIn(); // get info if a person is logged in
      main.$state       = $state;                   // set the current state
      main.sortType     = 'roll';                   // set the default sort type
      main.sortReverse  = true;                    // set the default sort order
      main.searchBro    = '';                       // set the default search/filter term

      // ***************************************
      // on every change of state ...
      $rootScope.$on('$stateChangeStart', function() {

        // update and store users logged in status
        main.loggedIn = authFactory.isLoggedIn();

        // refresh active brothers
        main.init();

        // continuously updated the currently logged on user
        authFactory.getUser().then(function(data) {
          main.current = data.data;
          console.log('Main.current:' + JSON.stringify(main.current));
        });
      });

      // ***************************************
    	// for logging in a user
    	main.doLogin = function() {

    		// clear any current error
    		main.error = '';

        // perform login
    		authFactory.login(main.loginData.username, main.loginData.password).success(function(data) {

          // redirect as neccesary
    			if (data.success) $state.go('main.brothers');
    			else main.error = data.message;
    		});
    	};

      // ***************************************
      // for logging out a user
      main.doLogout = function() {
        authFactory.logout();
        main.current = '';
        main.loggedIn = false;
      };

      // ***************************************
      main.init = function() {
        // get all brothers
        crudFactory.get().success(function(data) {
          main.brothers = data;
        });
      };
      main.init();
    };

    mainController.$inject = ['$state', '$rootScope', 'authFactory', 'crudFactory'];

    angular.module('zgApp').controller('mainController', mainController);

}());
