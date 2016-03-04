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
          templateUrl: 'views/layout.html',
          controller  : 'mainController as main'
        })
        //===========================================
        //* Basic controllers everyone can see */
        .state('main.home', {
          url: '/home',
          templateUrl: 'views/homepage.html'
        })
        .state('main.login', {
          url: '/login',
          templateUrl: 'views/login.html'
        })
        //===========================================
        //* Brothers */
        .state('main.brothers', {
          url: '/brothers',
          templateUrl: 'views/brothers.html',
          controller: 'listingController as listing'
        })

        .state('main.profile', {
          url: '/brothers/:brotherid',
          templateUrl: 'views/profile.html',
          controller  : 'editController as brother'
        })

        //===========================================
        /* Admin controllers */
        .state('main.admin', {
          url: '/admin',
          templateUrl: 'views/adminBrothers.html',
          controller  : 'adminController as admin'
        })
        .state('main.create', {
          url: '/admin/brothers/create',
          templateUrl: 'views/profile.html',
          controller  : 'createController as brother'
        })

        .state('main.edit', {
          url: '/admin/brothers/:brotherid',
          templateUrl: 'views/profile.html',
          controller  : 'editController as brother'
        })


    };

    // Inject this way for minification
    appRoutes.$inject = ['$stateProvider'];

    //Attach to app
    angular.module('routes').config(appRoutes);
}());
