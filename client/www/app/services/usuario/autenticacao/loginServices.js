(function () {
    'use strict';

    var loginServicesId = 'loginServices';

    function loginServices($http, autenticacao, connection) {

        function login(usuario) {
            return $http.post(connection.base() + '/autenticacao/login', usuario);
        }

        function registrar(usuario) {
            return $http.post(connection.base() + '/autenticacao/registrar', usuario);
        }

        function logout() {
            autenticacao.deleteAuth();
        }
        
        function resetPassword(email) {
            return $http.post(connection.base() + '/autenticacao/resetPassword/'+ email);
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