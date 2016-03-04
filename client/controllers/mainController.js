// best practice: wrap in function to take out of global scope
(function() {

  // this controller handles everything on the public side:
  var mainController = function($state, $rootScope, authFactory, crudFactory, $window){

    // =========================================================================
    // =========================================================================
    // set controller as, logged in status, state
    var main      = this;
    main.loggedIn = authFactory.isLoggedIn();
    main.$state   = $state;

    // =========================================================================
    // =========================================================================
    // on every change of state ...
    $rootScope.$on('$stateChangeStart', function() {

      // update status, refresh active brothers, refresh logged on user
      main.init();
      main.loggedIn = authFactory.isLoggedIn();

      // update the info if logged in
      if(main.loggedIn && $window.localStorage.getItem('token')){
        authFactory.getUser()
        .success(function(res){
          if (res.success){
            main.current = res.info;
            console.log('Current user:' + JSON.stringify(main.current));
          }
        })
        .error(function(res){
          console.log ('Uncaught error: ' + res.message);
        });
      }
    });

    // =========================================================================
    // =========================================================================
    // for populating the brothers table
    main.init = function() {
      crudFactory.get()
      .success(function(res){
        if (res.success){
          main.brothers = res.info;
        }
      })
      .error(function(res){
        console.log ('Uncaught error: ' + res.message);
      });
    };
    main.init(); // initialize brothers

    // =========================================================================
    // =========================================================================
    // for logging in a user
    main.doLogin = function() {
    	main.error = '';
    	authFactory.login(main.loginData.username, main.loginData.password)
      .success(function(res){
        if (res.success){
          $window.localStorage.setItem('token', res.token);
          $state.go('main.brothers');
        }
      })
      .error(function(res){
        if (!res.success){
          main.error = res.message;
        }
      });
    };

    // =========================================================================
    // =========================================================================
    // for logging out a user
    main.doLogout = function() {
      authFactory.logout();
      main.current = '';
      main.loggedIn = false;
    };
  };

  // =========================================================================
  // =========================================================================
    // for minification purposes
    mainController.$inject = ['$state', '$rootScope', 'authFactory', 'crudFactory', '$window'];
    // Attach the controller to the app
    angular.module('zgApp').controller('mainController', mainController);
}());
