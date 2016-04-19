(function () {
    'use strict';

    var denunciaServicesId = 'denunciaServices';

    function denunciaServices($http, connection) {
        
        function obterTodas() {
            return $http.get(connection.base() + '/denuncia/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/denuncia/obterPorId/' + id);
        }

        function adicionar(denuncia){
            return $http.post(connection.base() + '/denuncia/adicionar', denuncia);
        }

        function editar(denuncia){
            return $http.post(connection.base() + '/denuncia/editar', denuncia);
        }

        function remover(id){
            return $http.post(connection.base() + '/denuncia/remover/' + id);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover
        };

        return services;
    }

    angular.module('cotarApp').factory(denunciaServicesId, ['$http', 'connection', denunciaServices]);
})();
