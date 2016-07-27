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

        function obterSalasPorSolicitacao(solicitacoes) {
            return $http.post(connection.baseWeb() + '/api/salas/obterSalasPorSolicitacao', solicitacoes);
        }

        function adicionar(sala) {
            //return $http.post(connection.base() + '/sala/adicionar', sala);
            return $http.post(connection.baseWeb() + '/api/salas', sala);
        }

        function remover(id) {
            return $http.post(connection.base() + '/sala/remover/' + id);
        }

        function editar(sala) {
            return $http.post(connection.baseWeb() + '/api/salas/editar', sala);
        }

        function obterSalasPorUsuarioId(id) {
            return $http.get(connection.baseWeb() + '/api/salas/obterSalasPorUsuarioId/' + id);
        }

        function obterSalaPorSolicitacaoEProduto(sala) {
            return $http.post(connection.baseWeb() + '/api/salas/obterSalaPorSolicitacaoEProduto', sala);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            obterPorSolicitacaoId: obterPorSolicitacaoId,
            obterSalasPorSolicitacao: obterSalasPorSolicitacao,
            adicionar: adicionar,
            remover: remover,
            obterSalasPorUsuarioId: obterSalasPorUsuarioId,
            editar: editar,
            obterSalaPorSolicitacaoEProduto: obterSalaPorSolicitacaoEProduto
        };

        return services;
    }

    angular.module('cotarApp').factory(salaServicesId, ['$http', 'connection', salaServices]);
})();
