(function () {
    'use strict';

    var salaUsuarioServicesId = 'salaUsuarioServices';

    function salaUsuarioServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/salaUsuario/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/salaUsuario/obterPorId/' + id);
        }

        function obterPorUsuarioId(id) {
            return $http.get(connection.base() + '/salaUsuario/obterPorUsuarioId/' + id);
        }

        function adicionar(salaUsuario){
            return $http.post(connection.base() + '/salaUsuario/adicionar', salaUsuario);
        }

        function remover(id){
            return $http.post(connection.base() + '/salaUsuario/remover/'+ id);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            obterPorUsuarioId: obterPorUsuarioId,
            adicionar: adicionar,
            remover: remover
        };

        return services;
    }

    angular.module('cotarApp').factory(salaUsuarioServicesId, ['$http', 'connection', salaUsuarioServices]);
})();
