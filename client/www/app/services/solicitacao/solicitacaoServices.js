(function () {
    'use strict';

    var solicitacaoServicesId = 'solicitacaoServices';

    function solicitacaoServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/solicitacao/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/solicitacao/obterPorId/' + id);
        }

        function solicitar(solicitacao) {
            return $http.post(connection.base() + '/solicitacao/solicitar', solicitacao);
        }

        function obterSolicitacoesPorCategoriaId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesPorCategoriaId/' + id);
        }

        function obterListaSolicitacoesPorCategoriaId(categorias) {
            return $http.post(connection.base() + '/solicitacao/obterListaSolicitacoesPorCategoriaId', categorias);
        }

        function obterSolicitacoesPorUsuarioId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesPorUsuarioId/' + id);
        }

        function obterSolicitacoesIdPorUsuarioId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesIdPorUsuarioId/' + id);
        }

        function editar(solicitacao) {
            return $http.post(connection.base() + '/solicitacao/editar', solicitacao);
        }

        function obterSolicitacoesPorUsuarioECategoria(solicitacao) {
            return $http.post(connection.base() + '/solicitacao/obterSolicitacoesPorUsuarioECategoria', solicitacao);
        }

        function obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId/' + id);
        }

        function obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId(categorias) {
            return $http.post(connection.base() + '/solicitacao/obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId', categorias);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            solicitar: solicitar,
            obterSolicitacoesPorCategoriaId: obterSolicitacoesPorCategoriaId,
            obterListaSolicitacoesPorCategoriaId: obterListaSolicitacoesPorCategoriaId,
            obterSolicitacoesPorUsuarioId: obterSolicitacoesPorUsuarioId,
            obterSolicitacoesIdPorUsuarioId: obterSolicitacoesIdPorUsuarioId,
            editar: editar,
            obterSolicitacoesPorUsuarioECategoria: obterSolicitacoesPorUsuarioECategoria,
            obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId: obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId,
            obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId: obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId
        };

        return services;
    }

    angular.module('cotarApp').factory(solicitacaoServicesId, ['$http', 'connection', solicitacaoServices]);
})();
