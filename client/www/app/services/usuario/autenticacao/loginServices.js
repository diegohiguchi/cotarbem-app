(function () {
    'use strict';

    var loginServicesId = 'loginServices';

    function loginServices($http, autenticacao, connection) {

        function login(usuario) {
            //return $http.post(connection.base() + '/autenticacao/login', usuario);
            return $http.post(connection.baseWeb() + '/api/auth/signin', usuario);
        }

        function registrar(usuario) {
            //return $http.post(connection.base() + '/autenticacao/registrar', usuario);
            return $http.post(connection.baseWeb() + '/api/auth/signup', usuario);
        }

        function logout() {
            autenticacao.deleteAuth();
        }
        
        function resetPassword(usuario) {
            return $http.post(connection.baseWeb() + '/api/auth/forgot', usuario);
        }
        
        var services = {
            login: login,
            registrar: registrar,
            logout: logout,
            resetPassword: resetPassword
        };

        return services;
    }

    angular.module('cotarApp').factory(loginServicesId, ['$http', 'autenticacao', 'connection', loginServices]);
})();