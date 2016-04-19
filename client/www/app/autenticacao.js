(function () {
    'use strict';

    var autenticacaoId = 'autenticacao';

    function autenticacao() {
        var userKey = 'user';
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

        function getUser() {
            return get(userKey);
        }

        function setUser(user) {
            return set(userKey, user);
        }

        function getToken() {
            return get(tokenKey);
        }

        function setToken(token) {
            return set(tokenKey, token);
        }

        function deleteAuth() {
            remove(userKey);
            remove(tokenKey);
        }

        var autenticacoes = {
            clear: clear,
            get: get,
            set: set,
            remove: remove,
            isLoggedIn: isLoggedIn,
            getUser: getUser,
            setUser: setUser,
            getToken: getToken,
            setToken: setToken,
            deleteAuth: deleteAuth
        };

        return autenticacoes;
    }

    angular.module('cotarApp').factory(autenticacaoId, [autenticacao]);
})();