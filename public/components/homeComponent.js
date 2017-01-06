angular.module('gCalTest').component('homeComponent', {
    templateUrl: "./views/homeComponent.html",
    controller: function homeController(userStocksService, $scope, $stateParams, $state) {
    
    setTimeout(function() {

        var getUser = (function() {
            userStocksService.getUserInfo().then(function(res) {
                $scope.firstName = res.data.first_name;
                $scope.lastName = res.data.last_name;
                $scope.userPic = res.data.pic_url;
                if (res.data) {
                    $scope.loggedIn = true;
                } else {
                    $scope.loggedIn = false;
                }
            })
        })();
        console.log($scope.loggedIn);
    }, 50);
    }
});
