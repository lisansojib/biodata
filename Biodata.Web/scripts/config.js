/// <reference path="../partials/yearly.html" />
angular.module('biodataChart')
.config(['$compileProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function (compileProvider, stateProvider, urlRouterProvider, $httpProvider) {
   // compileProvider.debugInfoEnabled(false); //debug information disabled
    $httpProvider.defaults.withCredentials = true;

    urlRouterProvider
            .otherwise('/');
    stateProvider
               .state("home", {
                   url: "/",
                   views: {
                       "main": {
                           templateUrl: 'partials/home.html'
                       }
                   }
               })
}])
.run(['$rootScope', '$state', '$stateParams', '$http',
    function ($rootScope, $state, $stateParams, $http) {
        $rootScope.$state = $state;
        //  $http.defaults.headers['Cookie'] = $cookies.get("cuser");
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            // handle route changes    

        });
    }])
