// best practice: wrap in function
(function() {

  // ui-state providier is iffy with active classes for navbars, this fixes it
  var uiSrefActiveIf = function($state) {
    return {
      restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
          var state = $attrs.uiSrefActiveIf;

          function update() {
            if ( $state.includes(state) || $state.is(state) )
              $element.addClass("active");
            else
              $element.removeClass("active");
          }

          $scope.$on('$stateChangeSuccess', update);
          update();
        }]
    };
  };

  // for minification purposes
  uiSrefActiveIf.$inject = ['$state'];

  angular.module('zgApp').directive('uiSrefActiveIf', uiSrefActiveIf);
}());


/*angular.module('zgApp')

// =============================================================================
// =============================================================================
.directive('uiSrefActiveIf', ['$state', function($state) {
    return {
        restrict: "A",
        controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
            var state = $attrs.uiSrefActiveIf;

            function update() {
                if ( $state.includes(state) || $state.is(state) ) {
                    $element.addClass("active");
                } else {
                    $element.removeClass("active");
                }
            }

            $scope.$on('$stateChangeSuccess', update);
            update();
        }]
    };
}]);*/
