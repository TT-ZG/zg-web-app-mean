angular.module('zgApp').service('fileUpload', ['$http', function ($http) {
  this.upload = function(file, uploadUrl, callback){
     var fd = new FormData();
     fd.append('file', file);
     $http.post(uploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
     })
     .success(callback)
     .error(callback);
 }
}]);
