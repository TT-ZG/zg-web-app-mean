// best practice: wrap in function
(function() {

    // Our apps states
    var appRoutes = function($stateProvider) {
      //Listings state providing
      $stateProvider
        //===========================================
        //* Main abstract controller */
        .state('main', {
          url: '',
          abstract: true,
          templateUrl: 'app/views/layout.html',
          controller  : 'mainController as main'
        })
        //===========================================
        //* Basic controllers everyone can see */
        .state('main.home', {
          url: '/home',
          templateUrl: 'app/views/homepage.html'
        })
        .state('main.login', {
          url: '/login',
          templateUrl: 'app/views/login.html'
        })
        //===========================================
        //* Brothers */
        .state('main.brothers', {
          url: '/brothers',
          templateUrl: 'app/views/brothers.html'
        })

        //===========================================
        /* Admin controllers */
        .state('main.admin', {
          url: '/admin',
          templateUrl: 'app/views/temp/brothers.html',
          controller  : 'adminController as admin'
        })
        .state('main.create', {
          url: '/brothers/create',
          templateUrl: 'app/views/temp/profile.html',
          controller  : 'createController as brother'
        })
        .state('main.edit', {
          url: '/brothers/:brotherid',
          templateUrl: 'app/views/temp/profile.html',
          controller  : 'editController as brother'
        })


    };

    // Inject this way for minification
    appRoutes.$inject = ['$stateProvider'];

    //Attach to app
    angular.module('routes').config(appRoutes);
}());



/*
angular.module('routes').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider) {
    //Listings state providing
    $stateProvider

      //===========================================
      //* Main abstract controller
      .state('main', {
        url: '',
        abstract: true,
        templateUrl: 'app/views/layout.html',
        controller  : 'mainController as main'
      })

      //===========================================
      //* Basic controllers everyone can see
      .state('main.home', {
        url: '/home',
        templateUrl: 'app/views/homepage.html'
      })
      .state('main.login', {
        url: '/login',
        templateUrl: 'app/views/login.html'
      })

      //===========================================
      /* Admin controllers
      .state('main.brothers', {
        url: '/brothers',
        templateUrl: 'app/views/brothers.html',
        controller  : 'adminController as admin'
      })
      .state('main.create', {
        url: '/brothers/create',
        templateUrl: 'app/views/profile.html',
        controller  : 'createController as brother'
      })
      .state('main.edit', {
        url: '/brothers/:brotherid',
        templateUrl: 'app/views/profile.html',
        controller  : 'editController as brother'
      })
  }
]);*/
