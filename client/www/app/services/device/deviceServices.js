(function () {
    'use strict';

    var deviceServicesId = 'deviceServices';

    function deviceServices($http, connection) {
        // 
        //         function register(device){
        //             return $http.post(connection.base() + '/register', {'device': device});
        //         }
        //      

        function adicionar(device) {
            return $http.post(connection.baseWeb() + '/api/devices/adicionar', device);
        }

        function editar(device) {
            return $http.post(connection.baseWeb() + '/api/devices/editar', device);
        }

        function notificar(device) {
            return $http.post(connection.baseWeb() + '/api/devices/notificar', device);
        }

        function notificarListaUsuarios(devices) {
            return $http.post(connection.baseWeb() + '/api/devices/notificarListaUsuarios', devices);
        }

        function notificarPorSubSegmento(device) {
            return $http.post(connection.baseWeb() + '/api/devices/notificarPorSubSegmento', device);
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/api/devices/' + id);
        }

        function obterPorUsuarioId(usuarioId) {
            //return $http.get(connection.base() + '/device/obterPorUsuarioId/' + id);
            return $http.get(connection.baseWeb() + '/api/devices/obterPorUsuarioId/' + usuarioId);
        }

        var services = {
            adicionar: adicionar,
            editar: editar,
            notificar: notificar,
            notificarListaUsuarios: notificarListaUsuarios,
            notificarPorSubSegmento: notificarPorSubSegmento,
            obterPorId: obterPorId,
            obterPorUsuarioId: obterPorUsuarioId
        };

        return services;
    }

    angular.module('cotarApp').factory(deviceServicesId, ['$http', 'connection', deviceServices]);
})();
