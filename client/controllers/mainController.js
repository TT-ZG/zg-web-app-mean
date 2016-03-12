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
            console.log(JSON.stringify(res.info));
            console.log(res.message);
          }
        })
        .error(function(res){
          console.log (res.message);
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
          console.log(res.message);
        }
      })
      .error(function(res){
        console.log(res.message);
      });
    };

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
          console.log(res.message);
        }
      })
      .error(function(res){
        if (!res.success){
          main.error = res.message;
          console.log(res.message);
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

    // =========================================================================
    // =========================================================================
    // get the data when the state is loaded
    main.init();
  };

  // =========================================================================
  // =========================================================================
    // for minification purposes
    mainController.$inject = ['$state', '$rootScope', 'authFactory', 'crudFactory', '$window'];
    // Attach the controller to the app
    angular.module('zgApp').controller('mainController', mainController);
}());
