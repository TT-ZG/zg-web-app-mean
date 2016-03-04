angular.module('zgApp').service('fileUpload', ['$http', function ($http) {
  this.upload = function(method, file, uploadUrl, callback){
     var fd = new FormData();
     fd.append('file', file);

     if (method === 'POST'){
       $http.post(uploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
       })
       .success(callback)
       .error(callback);
    }
    if (method === 'PUT'){
      $http.put(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      })
      .success(callback)
      .error(callback);
    }


 }
}]);
