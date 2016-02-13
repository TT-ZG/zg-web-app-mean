angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    //home is the default state
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // HOME STATES AND NESTED VIEWS ========================================
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/templates/user/home.html'
      });







      /*
        // HOME STATES AND NESTED VIEWS ========================================
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'app/views/templates/temp/partial-home.html'
        })

        // nested list with custom controller
        .state('dashboard.list', {
        url: '/list',
        templateUrl: 'app/views/templates/temp/partial-home-list.html',
        controller: function($scope) {
            $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        }
        })

        // nested list with just some random string data
        .state('dashboard.paragraph', {
          url: '/paragraph',
          template: 'I could sure use a drink right now.'
        })


        .state('about', {
        url: '/about',
        views: {

            // the main template will be placed here (relatively named)
            '': { templateUrl: 'app/views/templates/temp/partial-about.html' },

            // the child views will be defined here (absolutely named)
            'columnOne@about': { template: 'This column has its own view!' },

            // for column two, we'll define a separate controller
            'columnTwo@about': {
              template: 'This column also has its own view'
              /*
                templateUrl: 'table-data.html',
                controller: 'scotchController'
            }
        }

      });*/

});
