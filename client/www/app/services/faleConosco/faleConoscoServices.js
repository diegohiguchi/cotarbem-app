(function () {
    'use strict';

    var faleConoscoServicesId = 'faleConoscoServices';

    function faleConoscoServices($http, connection) {
        
        function obterTodas() {
            return $http.get(connection.base() + '/faleConosco/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/faleConosco/obterPorId/' + id);
        }

        function adicionar(faleConosco){
            return $http.post(connection.base() + '/faleConosco/adicionar', faleConosco);
        }

        function editar(faleConosco){
            return $http.post(connection.base() + '/faleConosco/editar', faleConosco);
        }

        function remover(id){
            return $http.post(connection.base() + '/faleConosco/remover/' + id);
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

    angular.module('cotarApp').factory(faleConoscoServicesId, ['$http', 'connection', faleConoscoServices]);
})();
