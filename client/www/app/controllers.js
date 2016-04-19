/*
angular.module('cotarApp.controllers', [])

    .controller('AppCtrl', ['$rootScope', '$ionicModal', 'AuthFactory', '$location', 'UserFactory', '$scope', 'Loader',
        function ($rootScope, $ionicModal, AuthFactory, $location, UserFactory, $scope, Loader) {

            $rootScope.$on('showLoginModal', function ($event, scope, cancelCallback, callback) {
                $scope.user = {
                    email: '',
                    password: ''
                };

                $scope = scope || $scope;

                $scope.viewLogin = true;

                $ionicModal.fromTemplateUrl('templates/login.html', {
                    scope: $scope
                }).then(function (modal) {
                    $scope.modal = modal;
                    $scope.modal.show();

                    $scope.switchTab = function (tab) {
                        if (tab === 'login') {
                            $scope.viewLogin = true;
                        } else {
                            $scope.viewLogin = false;
                        }
                    }

                    $scope.hide = function () {
                        $scope.modal.hide();
                        if (typeof cancelCallback === 'function') {
                            cancelCallback();
                        }
                    }

                    $scope.login = function () {
                        Loader.showLoading('Authenticating...');

                        UserFactory.login($scope.user).success(function (data) {

                            data = data.data;
                            AuthFactory.setUser(data.user);
                            AuthFactory.setToken({
                                token: data.token,
                                expires: data.expires
                            });

                            $rootScope.isAuthenticated = true;
                            $scope.modal.hide();
                            Loader.hideLoading();
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }).error(function (err, statusCode) {
                            Loader.hideLoading();
                            Loader.toggleLoadingWithMessage(err.message);
                        });
                    }

                    $scope.register = function () {
                        Loader.showLoading('Registering...');

                        UserFactory.register($scope.user).success(function (data) {

                            data = data.data;
                            AuthFactory.setUser(data.user);
                            AuthFactory.setToken({
                                token: data.token,
                                expires: data.expires
                            });

                            $rootScope.isAuthenticated = true;
                            Loader.hideLoading();
                            $scope.modal.hide();
                            if (typeof callback === 'function') {
                                callback();
                            }
                        }).error(function (err, statusCode) {
                            Loader.hideLoading();
                            Loader.toggleLoadingWithMessage(err.message);
                        });
                    }
                });
            });

            $rootScope.loginFromMenu = function () {
                $rootScope.$broadcast('showLoginModal', $scope, null, null);
            }

            $rootScope.logout = function () {
                UserFactory.logout();
                $rootScope.isAuthenticated = false;
                $location.path('/app/browse');
                Loader.toggleLoadingWithMessage('Successfully Logged Out!', 2000);
            }
        }
    ])

    .controller('BrowseCtrl', ['$scope', 'BooksFactory', 'LSFactory', 'Loader',
        function ($scope, BooksFactory, LSFactory, Loader) {

            Loader.showLoading();

            // support for pagination
            var page = 1;
            $scope.books = [];
            var books = LSFactory.getAll();

            // if books exists in localStorage, use that instead of making a call
            if (books.length > 0) {
                $scope.books = books;
                Loader.hideLoading();
            } else {
                BooksFactory.get(page).success(function (data) {

                    // process books and store them
                    // in localStorage so we can work with them later on,
                    // when the user is offline
                    processBooks(data.data.books);

                    $scope.books = data.data.books;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    Loader.hideLoading();
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                });
            }

            function processBooks(books) {
                LSFactory.clear();
                // we want to save each book individually
                // this way we can access each book info. by it's _id
                for (var i = 0; i < books.length; i++) {
                    LSFactory.set(books[i]._id, books[i]);
                }
                ;
            }

        }
    ])

    .controller('BookCtrl', ['$scope', '$state', 'LSFactory', 'AuthFactory', '$rootScope', 'UserFactory', 'Loader',
        function ($scope, $state, LSFactory, AuthFactory, $rootScope, UserFactory, Loader) {

            var bookId = $state.params.bookId;
            $scope.book = LSFactory.get(bookId);

            $scope.$on('addToCart', function () {
                Loader.showLoading('Adding to Cart..');
                UserFactory.addToCart({
                    id: bookId,
                    qty: 1
                }).success(function (data) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage('Successfully added ' + $scope.book.title + ' to your cart', 2000);
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                });

            });

            $scope.addToCart = function () {
                if (!AuthFactory.isLoggedIn()) {
                    $rootScope.$broadcast('showLoginModal', $scope, null, function () {
                        // user is now logged in
                        $scope.$broadcast('addToCart');
                    });
                    return;
                }
                $scope.$broadcast('addToCart');
            }
        }
    ])

    .controller('CartCtrl', ['$scope', 'AuthFactory', '$rootScope', '$location', '$timeout', 'UserFactory', 'Loader',
        function ($scope, AuthFactory, $rootScope, $location, $timeout, UserFactory, Loader) {

            $scope.$on('getCart', function () {
                Loader.showLoading('Fetching Your Cart..');
                UserFactory.getCartItems().success(function (data) {
                    $scope.books = data.data;
                    Loader.hideLoading();
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                });
            });

            if (!AuthFactory.isLoggedIn()) {
                $rootScope.$broadcast('showLoginModal', $scope, function () {
                    // cancel auth callback
                    $timeout(function () {
                        $location.path('/app/browse');
                    }, 200);
                }, function () {
                    // user is now logged in
                    $scope.$broadcast('getCart');
                });
                return;
            }

            $scope.$broadcast('getCart');

            $scope.checkout = function () {
                // we need to send only the id and qty
                var _cart = $scope.books;
                var cart = [];
                for (var i = 0; i < _cart.length; i++) {
                    cart.push({
                        id: _cart[i]._id,
                        qty: 1 // hardcoded to 1
                    });
                }
                ;

                Loader.showLoading('Checking out..');
                UserFactory.addPurchase(cart).success(function (data) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage('Successfully checked out', 2000);
                    $scope.books = [];
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                });
            }
        }
    ])

    .controller('PurchasesCtrl', ['$scope', '$rootScope', 'AuthFactory', 'UserFactory', '$timeout', 'Loader',
        function ($scope, $rootScope, AuthFactory, UserFactory, $timeout, Loader) {
            // http://forum.ionicframework.com/t/expandable-list-in-ionic/3297/2
            $scope.groups = [];

            $scope.toggleGroup = function (group) {
                if ($scope.isGroupShown(group)) {
                    $scope.shownGroup = null;
                } else {
                    $scope.shownGroup = group;
                }
            };
            $scope.isGroupShown = function (group) {
                return $scope.shownGroup === group;
            };

            $scope.$on('getPurchases', function () {
                Loader.showLoading('Fetching Your Purchases');
                UserFactory.getPurchases().success(function (data) {
                    var purchases = data.data;
                    $scope.purchases = [];
                    for (var i = 0; i < purchases.length; i++) {
                        var key = Object.keys(purchases[i]);
                        $scope.purchases.push(key[0]);
                        $scope.groups[i] = {
                            name: key[0],
                            items: purchases[i][key]
                        }
                        var sum = 0;
                        for (var j = 0; j < purchases[i][key].length; j++) {
                            sum += parseInt(purchases[i][key][j].price);
                        }
                        ;
                        $scope.groups[i].total = sum;
                    }
                    ;
                    Loader.hideLoading();
                }).error(function (err, statusCode) {
                    Loader.hideLoading();
                    Loader.toggleLoadingWithMessage(err.message);
                });
            });

            if (!AuthFactory.isLoggedIn()) {
                $rootScope.$broadcast('showLoginModal', $scope, function () {
                    $timeout(function () {
                        $location.path('/app/browse');
                    }, 200);
                }, function () {
                    // user is now logged in
                    $scope.$broadcast('getPurchases');
                });
                return;
            }

            $scope.$broadcast('getPurchases');
        }
    ])

    .controller('SolicitaCotacaoCtrl', [function () {

    }]);

*/


angular.module('chat.controllers', [])

    .controller('ChatCtrl', function($scope, $stateParams, $ionicPopup, $timeout, Socket, Chat) {

        $scope.data = {};
        $scope.data.message = "";
        $scope.messages = Chat.getMessages();
        var typing = false;
        var lastTypingTime;
        var TYPING_TIMER_LENGTH = 250;

        Socket.on('connect',function(){

            if(!$scope.data.username){
                var nicknamePopup = $ionicPopup.show({
                    template: '<input id="usr-input" type="text" ng-model="data.username" autofocus>',
                    title: 'What\'s your nickname?',
                    scope: $scope,
                    buttons: [{
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.username) {
                                e.preventDefault();
                            } else {
                                return $scope.data.username;
                            }
                        }
                    }]
                });
                nicknamePopup.then(function(username) {
                    Socket.emit('add user',username);
                    Chat.setUsername(username);
                });
            }

        });

        Chat.scrollBottom();

        if($stateParams.username){
            $scope.data.message = "@" + $stateParams.username;
            document.getElementById("msg-input").focus();
        }

        var sendUpdateTyping = function(){
            if (!typing) {
                typing = true;
                Socket.emit('typing');
            }
            lastTypingTime = (new Date()).getTime();
            $timeout(function () {
                var typingTimer = (new Date()).getTime();
                var timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    Socket.emit('stop typing');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        };

        $scope.updateTyping = function(){
            sendUpdateTyping();
        };

        $scope.messageIsMine = function(username){
            return $scope.data.username === username;
        };

        $scope.getBubbleClass = function(username){
            var classname = 'from-them';
            if($scope.messageIsMine(username)){
                classname = 'from-me';
            }
            return classname;
        };

        $scope.sendMessage = function(msg){
            Chat.sendMessage(msg);
            $scope.data.message = "";
        };

    })

    .controller('PeopleCtrl', function($scope, Users) {
        $scope.data = Users.getUsers();
    })

    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope, Chat) {
        $scope.username = Chat.getUsername();
    }, true);
