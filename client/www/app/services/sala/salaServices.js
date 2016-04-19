(function () {
    'use strict';

    var salaServicesId = 'salaServices';

    function salaServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/sala/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/sala/obterPorId/' + id);
        }

        function obterPorSolicitacaoId(id) {
            return $http.get(connection.base() + '/sala/obterPorSolicitacaoId/' + id);
        }

        function obterListaSalasPorSolicitacaoId(solicitacoes) {
            return $http.post(connection.base() + '/sala/obterListaSalasPorSolicitacaoId', solicitacoes);
        }

        function adicionar(sala) {
            return $http.post(connection.base() + '/sala/adicionar', sala);
        }

        function remover(id) {
            return $http.post(connection.base() + '/sala/remover/' + id);
        }

        function obterPorUsuarioId(id) {
            return $http.get(connection.base() + '/sala/obterPorUsuarioId/' + id);
        }

        function editar(sala) {
            return $http.post(connection.base() + '/sala/editar', sala);
        }

        function obterSalaPorSolicitacaoEProduto(sala) {
            return $http.post(connection.base() + '/sala/obterSalaPorSolicitacaoEProduto', sala);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            obterPorSolicitacaoId: obterPorSolicitacaoId,
            obterListaSalasPorSolicitacaoId: obterListaSalasPorSolicitacaoId,
            adicionar: adicionar,
            remover: remover,
            obterPorUsuarioId: obterPorUsuarioId,
            editar: editar,
            obterSalaPorSolicitacaoEProduto: obterSalaPorSolicitacaoEProduto
        };

        return services;
    }

    angular.module('cotarApp').factory(salaServicesId, ['$http', 'connection', salaServices]);
})();
