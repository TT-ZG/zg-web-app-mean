// best practice: wrap in function to take out of global scope
(function() {

  // this controller handles:
  // - logging in and out
  // - keeping track of the current users info
  // - populating the brothers table
  // - handling brothers table queries
  var mainController = function($state, $rootScope, authFactory, crudFactory){

    // ***************************************
    // set data
    var main          = this;                     // 'controller as' rather than main
    main.loggedIn     = authFactory.isLoggedIn(); // get info if a person is logged in
    main.$state       = $state;                   // set the current state

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
    	authFactory.login(main.loginData.username, main.loginData.password)
      .success(function(data) {
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
    // for populating the brothers table
    main.init = function() {
      // get all brothers
      crudFactory.get().success(function(data) {
        main.brothers = data;

      });
    };
    main.init();


    // ***************************************
    // for handling checkbox filters
    main.sortType     = 'roll';         // set the default sort type
    main.sortReverse  = true;           // set the default sort order
    main.search       = '';             // set the default search/filter term
    main.filter       = {};             // holds our filter terms

    // The options available for standings
    main.standings = [
      { property : "standing", value: "Active" },
      { property : "standing", value: "Alumni" },
    ];

    // The relevant options available for employment seeking status
    main.availables = [
      { property : "available", value: "Internship" },
      { property : "available", value: "Full-Time" },
      { property : "available", value: "Part-Time" },
    ];

    // Filter by property
    main.filterByProperties = function (brother) {
      // Use this snippet for matching with AND
      var matchesAND = true;
      for (var prop in main.filter) {
        if (noSubFilter(main.filter[prop])) continue;
        if (!main.filter[prop][brother[prop]]) {
          matchesAND = false;
          break;
        }
      }
      return matchesAND;

      /* Use this snippet for matching with OR
      var matchesOR = true;
      for (var prop in main.filter) {
        if (noSubFilter(main.filter[prop])) continue;
        if (!main.filter[prop][wine[prop]]) {
          matchesOR = false;
        } else {
          matchesOR = true;
          break;
        }
      }
      return matchesOR;*/
    };

    // checks if there is any filter activated
    function noSubFilter(subFilterObj) {
      for (var key in subFilterObj) {
        if (subFilterObj[key]) return false;
      }
      return true;
    }
  };// end of mainController function

    // ***************************************
    // for minification purposes
    mainController.$inject = ['$state', '$rootScope', 'authFactory', 'crudFactory'];

    // attach the controller
    angular.module('zgApp').controller('mainController', mainController);
}());
