// best practice: wrap in function to take out of global scope
(function() {

  // this controller handles everything on the mainlic side:
  var mainController = function($state, $scope, $rootScope, authFactory, crudFactory, $window, $cookieStore, items){
    // *************************************************************************
    // set controller as, defaults
    var main         = this;
    main.loggedIn    = authFactory.isLoggedIn();
    main.$state      = $state;
    main.standings   = items.getStandings();
    main.availables  = items.getAvailables();
    main.gpas        = items.getGpas();
    main.sortType    = 'roll';
    main.sortReverse = true;
    main.filter      = {};

    // *************************************************************************
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

    // *************************************************************************
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

    // *************************************************************************
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
    // *************************************************************************
    // for logging out a user
    main.doLogout = function() {
      authFactory.logout();
      main.current = '';
      main.loggedIn = false;
    };

    // *************************************************************************
    // Filter by property
    main.filterByProperties = function (brother) {
      // Use this snippet for matching with AND
      var matchesAND = true;
      for (var prop in main.filter) {
        if (main.noSubFilter(main.filter[prop])) continue;
        if (!main.filter[prop][brother[prop]]) {
          matchesAND = false;
          break;
        }
      }
      return matchesAND;
    };

    // checks if there is any filter activated
    main.noSubFilter = function(subFilterObj) {
      for (var key in subFilterObj) {
        if (subFilterObj[key]) return false;
      }
      return true;
    };

    // *************************************************************************
    // set the id of the clicked row in scope because uirouter doesn't accept angular exp as parameters
    main.setID = function(brother){
      main.desiredID = brother._id;
    };

    // *************************************************************************
    main.init();
  };

    // *************************************************************************
  // for minification purposes
  mainController.$inject = ['$state', '$scope', '$rootScope', 'authFactory', 'crudFactory', '$window', '$cookieStore', 'items'];

  // Attach the controller to the app
  angular.module('zgApp').controller('mainController', mainController);
}());
