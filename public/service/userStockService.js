angular.module("gCalTest")
  .service("userStocksService", function($http){
    this.getUserInfo = function(){
      return $http.get("getuserinfo");
    };
    this.signOut = function() {
      console.log("fired from userStocksService");
      return $http.get("/logout");
    }
});
