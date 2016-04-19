(function () {
    'use strict';

    var deviceTokenServicesId = 'deviceTokenServices';

    function deviceTokenServices($http, connection) {
        // 
        //         function register(deviceToken){
        //             return $http.post(connection.base() + '/register', {'deviceToken': deviceToken});
        //         }
        //         
        function register(device) {
            return $http.post(connection.base() + '/deviceToken/register', device);
        }

        function editar(device) {
            return $http.post(connection.base() + '/deviceToken/editar', device);
        }

        function notificar(device) {
            return $http.post(connection.base() + '/deviceToken/notificar', device);
        }

        function notificarUsuarios(device) {
            return $http.post(connection.base() + '/deviceToken/notificarUsuarios', device);
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/deviceToken/obterPorId/' + id);
        }

        function obterPorUsuarioId(id) {
            return $http.get(connection.base() + '/deviceToken/obterPorUsuarioId/' + id);
        }

        var services = {
            register: register,
            editar: editar,
            notificar: notificar,
            notificarUsuarios: notificarUsuarios,
            obterPorId: obterPorId,
            obterPorUsuarioId: obterPorUsuarioId
        };

        return services;
    }

    angular.module('cotarApp').factory(deviceTokenServicesId, ['$http', 'connection', deviceTokenServices]);
})();
