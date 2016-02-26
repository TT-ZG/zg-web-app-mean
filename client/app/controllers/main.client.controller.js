angular.module('zgApp')

.controller('mainCtrl', ['$state', '$rootScope', 'Auth', 'Crud',
  function($state, $rootScope, Auth, Crud){

    // ***************************************
    // set data
  	var main = this;                   // better to use 'controller as' rather than $scope
  	main.loggedIn = Auth.isLoggedIn(); // get info if a person is logged in
    main.$state = $state;               // set the current state

    // ***************************************
    // on every change of state ...
    $rootScope.$on('$stateChangeStart', function() {

      // update and store users logged in status
      main.loggedIn = Auth.isLoggedIn();

      // continuously updated the currently logged on user
      Auth.getUser().then(function(data) {
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
  		Auth.login(main.loginData.username, main.loginData.password).success(function(data) {

        // redirect as neccesary
  			if (data.success) $state.go('main.search');
  			else main.error = data.message;
  		});
  	};

    // ***************************************
    // for logging out a user
    main.doLogout = function() {
      Auth.logout();
      main.current = '';
      main.loggedIn = false;
    };

    // ***************************************
    // get all brothers
    Crud.get().success(function(data) {
  		main.brothers = data;
  	});

    // ***************************************
    // set the id in scope because uirouter doesn't accept angular exp as parameters
    main.setID = function(id){
      main.desiredID = id;
    };

    // ***************************************
    // delete a brother
    main.deleteBrother = function(id) {
      Crud.delete(id).success(function(data) {
          // get all users to update the table
          Crud.get().success(function(data) {
              main.brothers = data;
            });
        });
    };


  }
])


.controller('editCtrl', ['$state', '$stateParams', 'Crud',
  function($state, $stateParams, Crud){
    // better to use 'controller as' rather than $scope
    var main = this;

    // variable to determine if we should hide/show elements of the view
    main.type = 'edit';

    //===========================================
    // call a service to get a specific user
    Crud.read($stateParams.brotherid).success(function(data) {
        main.userData = data;
      });

    //===========================================
    // call a service to edit a specific user
    main.saveBrother = function() {
      main.message = '';

      Crud.update($stateParams.brotherid, main.userData).success(function(data) {
          main.userData = {};
          main.message = data.message;
        });
    };
  }
])

.controller('createCtrl', ['$state', '$stateParams', 'Crud',
  function($state, $stateParams, Crud){

    var main = this;

  	main.type = 'create';

  	//===========================================
  	// call a service to save a user
  	main.saveBrother = function() {
  		main.message = '';

  		// use the create function in the userService
  		Crud.create(main.userData).success(function(data) {
  				main.userData = {};
  				main.message = data.message;
  			});
  	};
  }
]);
