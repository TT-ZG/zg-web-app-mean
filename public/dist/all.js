!function(){angular.module("routes",[]);var e=angular.module("zgApp",["ui.router","ui.bootstrap","routes","ngAnimate","ngSanitize"]);e.config(["$urlRouterProvider","$locationProvider","$httpProvider",function(e,t,a){t.html5Mode(!0),e.otherwise("/home"),a.interceptors.push("interceptFactory")}]),e.run(["$state",function(e){e.go("main.home")}])}(),function(){var e=function(e){e.state("main",{url:"","abstract":!0,templateUrl:"views/layout.html",controller:"mainController as main"}).state("main.home",{url:"/home",templateUrl:"views/homepage.html"}).state("main.login",{url:"/login",templateUrl:"views/login.html"}).state("main.brothers",{url:"/brothers",templateUrl:"views/brothers.html",controller:"listingController as listing"}).state("main.profile",{url:"/brothers/:brotherid",templateUrl:"views/profile.html",controller:"editController as brother"}).state("main.admin",{url:"/admin",templateUrl:"views/adminBrothers.html",controller:"adminController as admin"}).state("main.create",{url:"/admin/brothers/create",templateUrl:"views/profile.html",controller:"createController as brother"}).state("main.edit",{url:"/admin/brothers/:brotherid",templateUrl:"views/profile.html",controller:"editController as brother"})};e.$inject=["$stateProvider"],angular.module("routes").config(e)}(),function(){var e=function(e,t,a){var r=this;r.init=function(){a.get().then(function(e){e.data.success&&(r.brothers=e.data.info),console.log(e.data.message)})},r.init(),r["delete"]=function(e,t){r.deleteBrother(e),r.deletePicture(t),r.init()},r.deleteBrother=function(e){a["delete"](e).then(function(e){console.log(e.data.message)})},r.deletePicture=function(e){a.deletePicture(e).then(function(e){console.log(e.data.message)})},r.resetPicture=function(e,t){r.deletePicture(t),r.userData={},r.userData.picture="0.jpg",a.update(e,r.userData).then(function(e){console.log(e.data.message),r.init()})},r.setID=function(e){r.desiredID=e}};e.$inject=["$state","$stateParams","crudFactory"],angular.module("zgApp").controller("adminController",e)}(),function(){var e=function(e,t,a,r,n){var s=this;s.standings=[{property:"standing",value:"Active"},{property:"standing",value:"Alumni"}],s.availables=[{property:"available",value:"Internship"},{property:"available",value:"Full-Time"},{property:"available",value:"Part-Time"},{property:"available",value:"Unavailable"}],s.gpas=[{property:"gpa",value:"3.00 - 3.32"},{property:"gpa",value:"3.33 - 3.66"},{property:"gpa",value:"3.67 - 4.00"},{property:"gpa",value:"On Request"}],s.userData={},s.userData.available="Unavailable",s.userData.gpa="On Request",s.userData.standing="Active",s.setDataMessages=function(e){e.data.success?(console.log("Success:"+e.data.message),s.dataMessage=e.data.message,s.dataError=""):(console.log("Error:"+e.data.message),s.dataError=e.data.message,s.dataMessage="")},s.setPictureMessages=function(e){e.data.success?(console.log("Success:"+e.data.message),s.pictureMessage=e.data.message,s.pictureError=""):(console.log("Error:"+e.data.message),s.pictureError=e.data.message,s.pictureMessage="")},s.resetMessages=function(){s.dataMessage="",s.pictureMessage="",s.dataError="",s.pictureError=""},s.resetInternships=function(){s.userData.internships=[{id:"1"}]},s.startSpinner=function(){s.processing=!0},s.endSpinner=function(){s.processing=!1},s.init=function(){s.startSpinner(),s.resetMessages(),s.resetInternships(),r.readPicture("0.jpg").then(function(t){t.data.success&&(e.image_source="data:image/jpeg;base64, "+t.data.data),s.setPictureMessages(t),s.endSpinner()})},s.saveBrother=function(){s.startSpinner(),s.resetMessages(),s.spliceArray(s.userData.internships),r.create(s.userData).then(function(e){e.data.success?s.uploadPicture(e.data.brotherId):s.endSpinner(),s.setDataMessages(e),s.resetInternships()})},s.uploadPicture=function(t){var a=e.myFile,r="POST",i="/api/pictures/"+t;n.upload(r,a,i,function(e,t,a,r){var n={};n.data=e,s.setPictureMessages(n),s.endSpinner()})},e.setFile=function(t){e.currentFile=t.files[0];var a=new FileReader;a.onload=function(t){e.image_source=t.target.result,e.$apply()},a.readAsDataURL(t.files[0])},s.addNewChoice=function(){var e=s.userData.internships.length+1;null!==s.userData.internships[s.userData.internships.length-1].name&&s.userData.internships.push({id:e})},s.removeChoice=function(){var e=s.userData.internships.length-1;0===e?s.resetInternships():s.userData.internships.splice(e)},s.spliceArray=function(e){var t=e.length-1;void 0===e[t].name&&e.splice(t)},s.init()};e.$inject=["$scope","$state","$stateParams","crudFactory","fileUpload"],angular.module("zgApp").controller("createController",e)}(),function(){var e=function(e,t,a,r,n){var s=this;s.standings=[{property:"standing",value:"Active"},{property:"standing",value:"Alumni"}],s.availables=[{property:"available",value:"Internship"},{property:"available",value:"Full-Time"},{property:"available",value:"Part-Time"},{property:"available",value:"Unavailable"}],s.gpas=[{property:"gpa",value:"3.00 - 3.32"},{property:"gpa",value:"3.33 - 3.66"},{property:"gpa",value:"3.67 - 4.00"},{property:"gpa",value:"On Request"}],s.setDataMessages=function(e){e.data.success?(console.log("Success:"+e.data.message),s.dataMessage=e.data.message,s.dataError=""):(console.log("Error:"+e.data.message),s.dataError=e.data.message,s.dataMessage="")},s.setPictureMessages=function(e){console.log(e),e.data.success?(console.log("Success:"+e.data.message),s.pictureMessage=e.data.message,s.pictureError=""):(console.log("Error:"+e.data.message),s.pictureError=e.data.message,s.pictureMessage="")},s.resetInternships=function(){s.userData.internships=[{id:"1"}]},s.resetMessages=function(){s.dataMessage="",s.pictureMessage="",s.dataError="",s.pictureError=""},s.startSpinner=function(){s.processing=!0},s.endSpinner=function(){s.processing=!1},s.get=function(e){s.resetMessages(),s.startSpinner(),a.read(e).then(function(e){e.data.success&&(s.setInfo(e),s.readPicture(s.userData.picture)),s.setDataMessages(e)})},s.readPicture=function(e){a.readPicture(e).then(function(e){e.data.success&&s.setPicture(e),s.setPictureMessages(e),s.endSpinner()})},s.saveBrother=function(){s.resetMessages(),s.startSpinner(),s.spliceArray(s.userData.internships),a.update(t.brotherid,s.userData).then(function(e){e.data.success&&s.savePicture(t.brotherid),s.setDataMessages(e),s.setInternships()})},s.savePicture=function(e){var t=r.myFile,a="PUT",i="/api/pictures/"+e;n.upload(a,t,i,function(e,t,a,r){var n={};n.data=e,s.setPictureMessages(n),s.endSpinner()})},s.setInfo=function(e){s.userData=e.data.info,s.userData.graduation=new Date(s.userData.graduation),s.setInternships()},s.setPicture=function(e){r.image_source="data:image/jpeg;base64, "+e.data.data},s.setInternships=function(){0===s.userData.internships.length&&s.resetInternships()},r.setFile=function(e){r.currentFile=e.files[0];var t=new FileReader;t.onload=function(e){r.image_source=e.target.result,r.$apply()},t.readAsDataURL(e.files[0])},s.addNewChoice=function(){var e=s.userData.internships.length+1;null!==s.userData.internships[s.userData.internships.length-1].name&&s.userData.internships.push({id:e})},s.removeChoice=function(){var e=s.userData.internships.length-1;0===e?s.resetInternships():s.userData.internships.splice(e)},s.spliceArray=function(e){var t=e.length-1;void 0===e[t].name&&e.splice(t)},s.get(t.brotherid)};e.$inject=["$state","$stateParams","crudFactory","$scope","fileUpload"],angular.module("zgApp").controller("editController",e)}(),function(){var e=function(){var e=this;e.sortType="roll",e.sortReverse=!0,e.search="",e.filter={},e.standings=[{property:"standing",value:"Active"},{property:"standing",value:"Alumni"}],e.availables=[{property:"available",value:"Internship"},{property:"available",value:"Full-Time"},{property:"available",value:"Part-Time"},{property:"available",value:"Unavailable"}],e.gpas=[{property:"gpa",value:"3.00 - 3.32"},{property:"gpa",value:"3.33 - 3.66"},{property:"gpa",value:"3.67 - 4.00"},{property:"gpa",value:"On Request"}],e.filterByProperties=function(t){var a=!0;for(var r in e.filter)if(!e.noSubFilter(e.filter[r])&&!e.filter[r][t[r]]){a=!1;break}return a},e.noSubFilter=function(e){for(var t in e)if(e[t])return!1;return!0},e.setID=function(t){e.desiredID=t._id}};e.$inject=[],angular.module("zgApp").controller("listingController",e)}(),function(){var e=function(e,t,a,r,n){var s=this;s.loggedIn=a.isLoggedIn(),s.$state=e,t.$on("$stateChangeStart",function(){s.init(),s.loggedIn=a.isLoggedIn(),s.loggedIn&&n.localStorage.getItem("token")&&a.getUser().then(function(e){e.data.success&&(s.current=e.data.info,console.log("Current logged on user: "+JSON.stringify(e.data.info.username))),console.log(e.data.message)})}),s.init=function(){r.get().then(function(e){e.data.success&&(s.brothers=e.data.info,console.log(e.data.message))})},s.init(),s.doLogin=function(){s.error="",a.login(s.loginData.username,s.loginData.password).then(function(t){t.data.success?(n.localStorage.setItem("token",t.data.token),e.go("main.brothers")):s.error=t.data.message,console.log(t.data.message)})},s.doLogout=function(){a.logout(),s.current="",s.loggedIn=!1}};e.$inject=["$state","$rootScope","authFactory","crudFactory","$window"],angular.module("zgApp").controller("mainController",e)}(),function(){var e=function(e,t,a){var r={login:function(t,a){return e.post("/api/authenticate",{username:t,password:a})},logout:function(){a.localStorage.removeItem("token")},isLoggedIn:function(){return!!a.localStorage.getItem("token")},getUser:function(){return e.get("/api/me")}};return r};e.$inject=["$http","$q","$window"],angular.module("zgApp").factory("authFactory",e)}(),function(){var e=function(e){var t={get:function(){return e.get("/api/brothers/")},read:function(t){return e.get("/api/brothers/"+t)},readPicture:function(t){return e.get("/api/pictures/"+t)},create:function(t){return e.post("/api/brothers/",t)},update:function(t,a){return e.put("/api/brothers/"+t,a)},"delete":function(t){return e["delete"]("/api/brothers/"+t)},deletePicture:function(t){return e["delete"]("/api/pictures/"+t)}};return t};e.$inject=["$http"],angular.module("zgApp").factory("crudFactory",e)}(),angular.module("zgApp").service("fileUpload",["$http",function(e){this.upload=function(t,a,r,n){var s=new FormData;s.append("file",a),"POST"===t&&e.post(r,s,{transformRequest:angular.identity,headers:{"Content-Type":void 0}}).success(n).error(n),"PUT"===t&&e.put(r,s,{transformRequest:angular.identity,headers:{"Content-Type":void 0}}).success(n).error(n)}}]),function(){var e=function(e,t,a,r){var n={request:function(e){var t=r.localStorage.getItem("token");return t&&(e.headers["x-access-token"]=t),e},responseError:function(e){return 401==e.status&&r.localStorage.removeItem("token"),403==e.status&&(r.localStorage.removeItem("token"),a.get("$state").transitionTo("main.home")),e}};return n};e.$inject=["$location","$q","$injector","$window"],angular.module("zgApp").factory("interceptFactory",e)}(),function(){var e=function(e){return{restrict:"A",link:function(t,a,r){var n=e(r.fileDirective),s=n.assign;a.bind("change",function(){t.$apply(function(){s(t,a[0].files[0])})})}}};e.$inject=["$parse"],angular.module("zgApp").directive("fileDirective",e)}(),function(){var e=function(e){return{restrict:"A",controller:["$scope","$element","$attrs",function(t,a,r){function n(){e.includes(s)||e.is(s)?a.addClass("active"):a.removeClass("active")}var s=r.uiSrefActiveIf;t.$on("$stateChangeSuccess",n),n()}]}};e.$inject=["$state"],angular.module("zgApp").directive("uiSrefActiveIf",e)}();