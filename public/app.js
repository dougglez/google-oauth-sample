angular.module('gCalTest', ['ui.router'])
    .config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state("home", {
      url: "/",
      templateUrl: "./views/home.html"
    }); //closes home state
}); //closes config
