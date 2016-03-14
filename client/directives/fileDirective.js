// best practice: wrap in function
(function() {

  // ng-model doesn't work with files, need to handle it ourselves
  var fileDirective = function($parse) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var model = $parse(attrs.fileDirective);
        var modelSetter = model.assign;

        element.bind('change', function(){
          scope.$apply(function(){
            modelSetter(scope, element[0].files[0]);
          });
        });
      }
    };
  };

  // for minification purposes
  fileDirective.$inject = ['$parse'];

  // attach the directive
  angular.module('zgApp').directive('fileDirective', fileDirective);
}());
