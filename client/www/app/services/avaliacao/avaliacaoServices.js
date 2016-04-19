(function () {
    'use strict';

    var avaliacaoServicesId = 'avaliacaoServices';

    function avaliacaoServices($http, connection) {
        
        function obterTodas() {
            return $http.get(connection.base() + '/avaliacao/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/avaliacao/obterPorId/' + id);
        }

        function adicionar(avaliacao){
            return $http.post(connection.base() + '/avaliacao/adicionar', avaliacao);
        }

        function editar(avaliacao){
            return $http.post(connection.base() + '/avaliacao/editar', avaliacao);
        }
        
        function obterPorCotacaoId(id) {
            return $http.get(connection.base() + '/avaliacao/obterPorCotacaoId/' + id);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            obterPorCotacaoId: obterPorCotacaoId
        };

        return services;
    }

    angular.module('cotarApp').factory(avaliacaoServicesId, ['$http', 'connection', avaliacaoServices]);
})();
