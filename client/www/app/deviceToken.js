(function () {
    'use strict';

    var deviceTokenId = 'deviceToken';

    function deviceToken() {
        var deviceKey = 'device';
        var tokenKey = 'token';

        function clear() {
            return localStorage.clear();
        }

        function get(key) {
            return JSON.parse(localStorage.getItem(key));
        }

        function set(key, data) {
            return localStorage.setItem(key, JSON.stringify(data));
        }

        function remove(key) {
            return localStorage.removeItem(key);
        }

        function isLoggedIn(){
            return this.getUser() === null ? false : true;
        }

        function getDeviceToken() {
            return get(deviceKey);
        }

        function setDeviceToken(device) {
            return set(deviceKey, device);
        }

        function getToken() {
            return get(tokenKey);
        }

        function setToken(token) {
            return set(tokenKey, token);
        }

        function deleteAuth() {
            remove(deviceKey);
            remove(tokenKey);
        }

        var deviceTokens = {
            clear: clear,
            get: get,
            set: set,
            remove: remove,
            isLoggedIn: isLoggedIn,
            getDeviceToken: getDeviceToken,
            setDeviceToken: setDeviceToken,
            getToken: getToken,
            setToken: setToken,
            deleteAuth: deleteAuth
        };

        return deviceTokens;
    }

    angular.module('cotarApp').factory(deviceTokenId, [deviceToken]);
})();