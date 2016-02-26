angular.module('zgApp').controller('mainCtrl', ['$state', '$rootScope', 'Login',
  function($state, $rootScope, Login){

    // better to use 'controller as' rather than $scope
  	var main = this;

    // get info if a person is logged in
  	main.loggedIn = Login.isLoggedIn();
    main.$state = $state;

    // ***************************************
    // on every change of state ...
    $rootScope.$on('$stateChangeStart', function() {

      // update and store users logged in status
      main.loggedIn = Login.isLoggedIn();
      console.log('Changing states. Logged in status: ' + main.loggedIn)

      // continuously updated the currently logged on user
      Login.getUser().then(function(data) {
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
  		Login.login(main.loginData.username, main.loginData.password).success(function(data) {

        // redirect as neccesary
  			if (data.success){
          console.log('Login successful.');
          $state.go('main.search');
        }
  			else{
          console.log('Login unsuccessful.');
          main.error = data.message;
        }
  		});
  	};
    // ***************************************
    // for logging out a user
    main.doLogout = function() {
      Login.logout();
      main.current = '';
      console.log('Changing to home...');
      //$state.go('visitors.home');
    };
  }
]);
