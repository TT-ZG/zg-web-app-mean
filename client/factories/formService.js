angular.module('zgApp').service('fileUpload', ['$http', function ($http) {
  this.uploadFileAndFieldsToUrl = function(file, fields, uploadUrl, callback){
     var fd = new FormData();
     fd.append('file', file);
     for(var i = 0; i < fields.length; i++){
         fd.append(fields[i].name, fields[i].data)
     }
     $http.post(uploadUrl, fd, {
         transformRequest: angular.identity,
         headers: {'Content-Type': undefined}
     })
     .success(callback)
     .error(callback);
 }
}]);
