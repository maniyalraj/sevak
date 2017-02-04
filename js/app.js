var app=angular.module('sevak',['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/main.html"
    })
    .when("/main2", {
        templateUrl : "views/main2.html"
    });
});