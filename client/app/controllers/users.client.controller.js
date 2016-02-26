angular.module('zgApp').controller('brotherCtrl', ['$state', '$rootScope',
  function($state, $rootScope){

    // better to use 'controller as' rather than $scope
  	var main = this;

    // get info if a person is logged in
  	main.bro = 'bro';

  }
]);
