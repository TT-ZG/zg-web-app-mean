angular.module('zgApp').service('profile', [function () {
    var loggedIn = false;

    return {
        setMessages: function (res) {
            if(res.data.success){
              console.log('Success:' + res.data.message);
            }
            else{
              console.log('Error:' + res.data.message);
            }
            return res.data.message;
          }

    };
}]);
