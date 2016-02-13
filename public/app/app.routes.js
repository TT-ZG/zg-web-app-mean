angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    //home is the default state
    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: 'app/views/partial-home.html'
        })

        // nested list with custom controller
        .state('home.list', {
        url: '/list',
        templateUrl: 'app/views/partial-home-list.html',
        controller: function($scope) {
            $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
        }
        })

    // nested list with just some random string data
    .state('home.paragraph', {
        url: '/paragraph',
        template: 'I could sure use a drink right now.'
    })

});
