// best practice: wrap in function to take out of global scope
(function() {

  // this controller handles everything on the public side:
  var mainController = function($state, $scope, $rootScope, authFactory, crudFactory, $window, $cookieStore){

    // =========================================================================
    // ================Set the initial logged in status=========================
    // =========================================================================
    // set controller as, logged in status, state
    var main      = this;
    main.loggedIn = authFactory.isLoggedIn();
    main.$state   = $state;

    // =========================================================================
    // ================This keeps track of the current user=====================
    // =========================================================================
    // on every change of state ...
    $rootScope.$on('$stateChangeStart', function() {

      // update status, refresh active brothers, refresh logged on user
      main.init();
      main.loggedIn = authFactory.isLoggedIn();
      console.log('Logged in:' + main.loggedIn);
      // update the info if logged in
      if(main.loggedIn && $window.localStorage.getItem('token')){
        authFactory.getUser()
          .then(function(res){
            if (res.data.success){
              main.current = res.data.info;
              console.log('Current logged on user: ' + JSON.stringify(res.data.info.username));
            }
            console.log(res.data.message);
          });
      }
    });

    // =========================================================================
    // ================This function populates the brothers table===============
    // =========================================================================
    // for populating the brothers table
    main.init = function() {
      crudFactory.get()
        .then(function(res){
          if (res.data.success){
            main.brothers = res.data.info;
            console.log(res.data.message);
          }
        });
    };
    main.init();

    // =========================================================================
    // ================These functions handle logging in and out================
    // =========================================================================
    // for logging in a user
    main.doLogin = function() {
    	main.error = '';
    	authFactory.login(main.loginData.username, main.loginData.password)
        .then(function(res){
          if (res.data.success){
            $window.localStorage.setItem('token', res.data.token);
            $state.go('main.brothers');
          } else{
            main.error = res.data.message;
          }
          console.log(res.data.message);
        });
    };
    // for logging out a user
    main.doLogout = function() {
      authFactory.logout();
      main.current = '';
      main.loggedIn = false;
    };
  };

  // ===========================================================================
  // ==========================End of controller================================
  // ===========================================================================
  // for minification purposes
  mainController.$inject = ['$state', '$scope', '$rootScope', 'authFactory', 'crudFactory', '$window', '$cookieStore'];

  // Attach the controller to the app
  angular.module('zgApp').controller('mainController', mainController);
}());
