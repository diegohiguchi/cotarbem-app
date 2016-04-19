/*
var base = 'http://localhost:3000';
//var base = 'https://ionic-book-store.herokuapp.com';

angular.module('cotarApp.factory', [])

.factory('Loader', ['$ionicLoading', '$timeout', function($ionicLoading, $timeout) {

    var LOADERAPI = {

        showLoading: function(text) {
            text = text || 'Loading...';
            $ionicLoading.show({
                template: text
            });
        },

        hideLoading: function() {
            $ionicLoading.hide();
        },

        toggleLoadingWithMessage: function(text, timeout) {
            var self = this;

            self.showLoading(text);

            $timeout(function() {
                self.hideLoading();
            }, timeout || 3000);
        }

    };
    return LOADERAPI;
}])

.factory('LSFactory', [function() {

    var LSAPI = {

        clear: function() {
            return localStorage.clear();
        },

        get: function(key) {
            return JSON.parse(localStorage.getItem(key));
        },

        set: function(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        },

        delete: function(key) {
            return localStorage.removeItem(key);
        },

        getAll: function() {
            var books = [];
            var items = Object.keys(localStorage);

            for (var i = 0; i < items.length; i++) {
                if (items[i] !== 'user' || items[i] != 'token') {
                    //books.push(JSON.parse(localStorage[items[i]]));
                }
            }

            return books;
        }

    };

    return LSAPI;

}])


.factory('AuthFactory', ['LSFactory', function(LSFactory) {

    var userKey = 'user';
    var tokenKey = 'token';

    var AuthAPI = {

        isLoggedIn: function() {
            return this.getUser() === null ? false : true;
        },

        getUser: function() {
            return LSFactory.get(userKey);
        },

        setUser: function(user) {
            return LSFactory.set(userKey, user);
        },

        getToken: function() {
            return LSFactory.get(tokenKey);
        },

        setToken: function(token) {
            return LSFactory.set(tokenKey, token);
        },

        deleteAuth: function() {
            LSFactory.delete(userKey);
            LSFactory.delete(tokenKey);
        }

    };

    return AuthAPI;

}])

.factory('TokenInterceptor', ['$q', 'AuthFactory', function($q, AuthFactory) {

    return {
        request: function(config) {
            config.headers = config.headers || {};
            var token = AuthFactory.getToken();
            var user = AuthFactory.getUser();

            if (token && user) {
                config.headers['X-Access-Token'] = token.token;
                config.headers['X-Key'] = user.email;
                config.headers['Content-Type'] = "application/json";
            }
            return config || $q.when(config);
        },

        response: function(response) {
            return response || $q.when(response);
        }
    };

}])


.factory('BooksFactory', ['$http', function($http) {

    var perPage = 30;

    var API = {
        get: function(page) {
            return $http.get(base + '/api/v1/books/' + page + '/' + perPage);
        }
    };

    return API;
}])

.factory('UserFactory', ['$http', 'AuthFactory',
    function($http, AuthFactory) {

        var UserAPI = {

            login: function(user) {
                return $http.post(base + '/login', user);
            },

            register: function(user) {
                return $http.post(base + '/register', user);
            },

            logout: function() {
                AuthFactory.deleteAuth();
            },

            getCartItems: function() {
                var userId = AuthFactory.getUser()._id;
                return $http.get(base + '/api/v1/users/' + userId + '/cart');
            },

            addToCart: function(book) {
                var userId = AuthFactory.getUser()._id;
                return $http.post(base + '/api/v1/users/' + userId + '/cart', book);
            },

            getPurchases: function() {
                var userId = AuthFactory.getUser()._id;
                return $http.get(base + '/api/v1/users/' + userId + '/purchases');
            },

            addPurchase: function(cart) {
                var userId = AuthFactory.getUser()._id;
                return $http.post(base + '/api/v1/users/' + userId + '/purchases', cart);
            }

        };

        return UserAPI;
    }
])
*/

angular.module('chat.services', [])

    .factory('Socket', function(socketFactory){
        var myIoSocket = io.connect('http://chat.socket.io:80');
        mySocket = socketFactory({
            ioSocket: myIoSocket
        });
        return mySocket;
    })

    .factory('Users', function(){
        var usernames = [];
        usernames.numUsers = 0;

        return {
            getUsers: function(){
                return usernames;
            },
            addUsername: function(username){
                usernames.push(username);
            },
            deleteUsername: function(username){
                var index = usernames.indexOf(username);
                if(index != -1){
                    usernames.splice(index, 1);
                }
            },
            setNumUsers: function(data){
                usernames.numUsers = data.numUsers;
            }
        };
    })

    .factory('Chat', function($ionicScrollDelegate, Socket, Users){

        var username;
        var users = {};
        users.numUsers = 0;

        var messages = [];
        var TYPING_MSG = '. . .';

        var Notification = function(username,message){
            var notification          = {};
            notification.username     = username;
            notification.message      = message;
            notification.notification = true;
            return notification;
        };

        Socket.on('login', function (data) {
            Users.setNumUsers(data);
        });

        Socket.on('new message', function(msg){
            addMessage(msg);
        });

        Socket.on('typing', function (data) {
            var typingMsg = {
                username: data.username,
                message: TYPING_MSG
            };
            addMessage(typingMsg);
        });

        Socket.on('stop typing', function (data) {
            removeTypingMessage(data.username);
        });

        Socket.on('user joined', function (data) {
            var msg = data.username + ' joined';
            var notification = new Notification(data.username,msg);
            addMessage(notification);
            Users.setNumUsers(data);
            Users.addUsername(data.username);
        });

        Socket.on('user left', function (data) {
            var msg = data.username + ' left';
            var notification = new Notification(data.username,msg);
            addMessage(notification);
            Users.setNumUsers(data);
            Users.deleteUsername(data.username);
        });

        var scrollBottom = function(){
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollBottom(true);
        };

        var addMessage = function(msg){
            msg.notification = msg.notification || false;
            messages.push(msg);
            scrollBottom();
        };

        var removeTypingMessage = function(usr){
            for (var i = messages.length - 1; i >= 0; i--) {
                if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
                    messages.splice(i, 1);
                    scrollBottom();
                    break;
                }
            }
        };

        return {
            getUsername: function(){
                return username;
            },
            setUsername: function(usr){
                username = usr;
            },
            getMessages: function() {
                return messages;
            },
            sendMessage: function(msg){
                messages.push({
                    username: username,
                    message: msg
                });
                scrollBottom();
                Socket.emit('new message', msg);
            },
            scrollBottom: function(){
                scrollBottom();
            }
        };
    })

    .factory('Chats', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });

