// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
//angular.module('cotarApp', ['ionic', 'cotarApp.controllers', 'cotarApp.factory'])
//angular.module('cotarApp', ['ionic', 'btford.socket-io', 'ngMessages', 'angularMoment', 'naif.base64'])
//angular.module('cotarApp', ['ionic', 'ngMessages', 'angularMoment', 'flow', 'fiestah.money', 'ngCordova', 'ionic.service.core', 'ionic.service.push'])
angular.module('cotarApp', ['ionic', 'btford.socket-io', 'ngMessages', 'angularMoment', 'flow', 'ngCordova', 'ionicLazyLoad',
    'firebase', 'ionic.service.core', 'ionic.service.push', 'ui.utils.masks', 'ionic.rating', 'ionic-zoom-view', 'ng-walkthrough'])

    .config(['$ionicAppProvider', function($ionicAppProvider) {
        // Identify app
        $ionicAppProvider.identify({
            // Your App ID
            app_id: '2424facc',
            // The public API key services will use for this app
            api_key: '752cc1b64af4dc6af1c7b4f94cba9d5481e6d9c429ca77a5',
            // Your GCM sender ID/project number (Uncomment if supporting Android)
            //gcm_id: 'YOUR_GCM_ID'
            gcm_id: '667747083606'
        });

    }])

    .run(function ($ionicPlatform, services, $cordovaBadge, autenticacao) {
        $ionicPlatform.ready(function () {
            var vm = this;

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

            /*$cordovaBadge.promptForPermission();

            function obterUsuarioLogado(){
                vm.usuario = autenticacao.getUser();
            }

            function obterNotificacoes(usuarioId) {
                services.notificacaoServices.obterNotificacoesEmAbertoPorUsuarioId(usuarioId).success(function (response) {
                    vm.notificacoes = response.data;

                    $cordovaBadge.hasPermission().then(function (result) {
                        $cordovaBadge.set(vm.notificacoes.length);
                    }, function (error) {
                        console.log(error);
                    });
                });
            }

            obterUsuarioLogado();
            obterNotificacoes(vm.usuario._id);
*/
           /* pushNotification = window.plugins.pushNotification;

            window.onNotification = function (e) {

                console.log('notification received');

                switch (e.event) {
                    case 'registered':
                        if (e.regid.length > 0) {

                            var appDeviceToken = e.regid;
                            services.deviceTokenServices.register(appDeviceToken).then(function (response) {
                                deviceToken.setDeviceToken(appDeviceToken);
                                deviceToken.setToken({
                                    token: response.token,
                                    expires: response.expires
                                });
                                //alert('registered!');
                            });
                        }
                        break;

                    case 'message':
                        //alert('msg received: ' + e.message);
                        //alert(JSON.stringify(e));
                        /!*
                         {
                         "message": "Hello this is a push notification",
                         "payload": {
                         "message": "Hello this is a push notification",
                         "sound": "notification",
                         "title": "New Message",
                         "from": "813xxxxxxx",
                         "collapse_key": "do_not_collapse",
                         "foreground": true,
                         "event": "message"
                         }
                         }
                         *!/
                        break;

                    case 'error':
                        alert('error occured');
                        break;

                }
            };

            window.errorHandler = function (error) {
                alert('an error occured');
            }

            pushNotification.register(
                onNotification,
                errorHandler,
                {
                    'badge': 'true',
                    'sound': 'true',
                    'alert': 'true',
                    'senderID': '667747083606',
                    'ecb': 'onNotification',

                }
            );*/

        });

    }).run(['$rootScope', 'autenticacao', '$location',
        function ($rootScope, autenticacao, $location) {

            $rootScope.isAuthenticated = autenticacao.isLoggedIn();

            if (!$rootScope.isAuthenticated)
                $location.path('/login');
            // utility method to convert number to an array of elements
            $rootScope.getNumber = function (num) {
                return new Array(num);
            }

        }
    ])

/* .config(['$ionicAppProvider', function ($ionicAppProvider) {
 // Identify app
 $ionicAppProvider.identify({
 // The App ID for the server
 app_id: '2424facc',
 // The API key all services will use for this app
 api_key: '752cc1b64af4dc6af1c7b4f94cba9d5481e6d9c429ca77a5',
 dev_push: true
 })
 }])*/

/*.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
 function ($stateProvider, $urlRouterProvider, $httpProvider) {

 // setup the token interceptor
 $httpProvider.interceptors.push('TokenInterceptor');

 $stateProvider

 .state('app', {
 url: "/app",
 abstract: true,
 templateUrl: "templates/menu.html",
 controller: 'AppCtrl'
 })

 .state('app.solicitaCotacao', {
 url: "/solicitaCotacao",
 views: {
 'menuContent': {
 templateUrl: "templates/solicitaCotacao.html",
 controller: 'SolicitaCotacaoCtrl as vm'
 }
 }
 })

 .state('app.browse', {
 url: "/browse",
 views: {
 'menuContent': {
 templateUrl: "templates/browse.html",
 controller: 'BrowseCtrl'
 }
 }
 })

 .state('app.book', {
 url: "/book/:bookId",
 views: {
 'menuContent': {
 templateUrl: "templates/book.html",
 controller: 'BookCtrl'
 }
 }
 })

 .state('app.cart', {
 url: "/cart",
 views: {
 'menuContent': {
 templateUrl: "templates/cart.html",
 controller: 'CartCtrl'
 }
 }
 })


 .state('app.purchases', {
 url: "/purchases",
 views: {
 'menuContent': {
 templateUrl: "templates/purchases.html",
 controller: 'PurchasesCtrl'
 }
 }
 });
 // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/app/solicitaCotacao');
 }
 ])*/

