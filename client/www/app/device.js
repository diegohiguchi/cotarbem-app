(function () {
    'use strict';

    var deviceId = 'device';

    function device() {
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

        function getDevice() {
            return get(deviceKey);
        }

        function setDevice(device) {
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

        var devices = {
            clear: clear,
            get: get,
            set: set,
            remove: remove,
            isLoggedIn: isLoggedIn,
            getDevice: getDevice,
            setDevice: setDevice,
            getToken: getToken,
            setToken: setToken,
            deleteAuth: deleteAuth
        };

        return devices;
    }

    angular.module('cotarApp').factory(deviceId, [device]);
})();