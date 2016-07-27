(function () {
    'use strict';

    var solicitacaoServicesId = 'solicitacaoServices';

    function solicitacaoServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/solicitacao/obterTodas');
        }

        function obterPorId(solicitacaoId) {
            //return $http.get(connection.base() + '/solicitacao/obterPorId/' + id);
            return $http.get(connection.baseWeb() + '/api/solicitacoes/' + solicitacaoId);
        }

        function solicitar(solicitacao) {
            // return $http.post(connection.base() + '/solicitacao/solicitar', solicitacao);
            return $http.post(connection.baseWeb() + '/api/solicitacoes', solicitacao);
        }

        function obterSolicitacoesPorSubSegmentos(subSegmentos) {
            return $http.post(connection.baseWeb() + '/api/solicitacoes/obterSolicitacoesPorSubSegmentos', subSegmentos);
        }

        function obterSolicitacoesPorCategoriaId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesPorCategoriaId/' + id);
        }

        function obterListaSolicitacoesPorCategoriaId(categorias) {
            return $http.post(connection.base() + '/solicitacao/obterListaSolicitacoesPorCategoriaId', categorias);
        }

        function obterSolicitacoesPorUsuarioId(id) {
            // return $http.get(connection.base() + '/solicitacao/obterSolicitacoesPorUsuarioId/' + id);
            return $http.get(connection.baseWeb() + '/api/solicitacoes/obterSolicitacoesPorUsuarioId/' + id);
        }

        function obterSolicitacoesIdPorUsuarioId(id) {
            return $http.get(connection.base() + '/solicitacao/obterSolicitacoesIdPorUsuarioId/' + id);
        }

        function editar(solicitacao) {
            // return $http.post(connection.base() + '/solicitacao/editar', solicitacao);
            return $http.post(connection.baseWeb() + '/api/solicitacoes/editar', solicitacao);
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

        function obterUltimaSolicitacaoPorUsuarioId(usuarioId) {
            return $http.get(connection.baseWeb() + '/api/solicitacoes/obterUltimaSolicitacaoPorUsuarioId/' + usuarioId);
        }

        function obterUltimaSolicitacaoPorSubSegmentos(subSegmentos) {
            return $http.post(connection.baseWeb() + '/api/solicitacoes/obterUltimaSolicitacaoPorSubSegmentos', subSegmentos);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            solicitar: solicitar,
            obterSolicitacoesPorSubSegmentos: obterSolicitacoesPorSubSegmentos,
            obterSolicitacoesPorCategoriaId: obterSolicitacoesPorCategoriaId,
            obterListaSolicitacoesPorCategoriaId: obterListaSolicitacoesPorCategoriaId,
            obterSolicitacoesPorUsuarioId: obterSolicitacoesPorUsuarioId,
            obterSolicitacoesIdPorUsuarioId: obterSolicitacoesIdPorUsuarioId,
            editar: editar,
            obterSolicitacoesPorUsuarioECategoria: obterSolicitacoesPorUsuarioECategoria,
            obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId: obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorUsuarioId,
            obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId: obterSolicitacoesAtivasExcetoUltimaSolicitacaoPorCategoriaId,
            obterUltimaSolicitacaoPorUsuarioId: obterUltimaSolicitacaoPorUsuarioId,
            obterUltimaSolicitacaoPorSubSegmentos: obterUltimaSolicitacaoPorSubSegmentos
        };

        return services;
    }

    angular.module('cotarApp').factory(solicitacaoServicesId, ['$http', 'connection', solicitacaoServices]);
})();
