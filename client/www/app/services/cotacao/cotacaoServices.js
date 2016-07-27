(function () {
    'use strict';

    var cotacaoServicesId = 'cotacaoServices';

    function cotacaoServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/cotacao/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/cotacao/obterPorId/' + id);
        }

        function obterPorSolicitacaoId(id) {
            return $http.get(connection.base() + '/cotacao/obterPorSolicitacaoId/' + id);
        }

        function obterPorProdutoNome(nome) {
            return $http.get(connection.base() + '/cotacao/obterPorProdutoNome/' + nome);
        }

        function obterListaCotacoesPorProdutoId(id) {
            return $http.get(connection.base() + '/cotacao/obterListaCotacoesPorProdutoId/' + id);
        }

        function adicionar(cotacao) {
            //return $http.post(connection.base() + '/cotacao/adicionar', cotacao);
            return $http.post(connection.baseWeb() + '/api/cotacoes', cotacao);
        }

        function editar(cotacao) {
            //return $http.post(connection.base() + '/cotacao/editar', cotacao);
            return $http.post(connection.baseWeb() + '/api/cotacoes/editar', cotacao);
        }

        function remover(id) {
            return $http.post(connection.base() + '/cotacao/remover/' + id);
        }

        function obterCotacaoPorSolicitacaoEUsuario(cotacao) {
            return $http.post(connection.baseWeb() + '/api/cotacoes/obterCotacaoPorSolicitacaoEUsuario', cotacao);
        }

        function obterCotacoesPorSolicitacaoEProduto(cotacao) {
            return $http.post(connection.baseWeb() + '/api/cotacoes/obterCotacoesPorSolicitacaoEProduto', cotacao);
        }

        function obterListaPorSolicitacaoId(id) {
            return $http.get(connection.base() + '/cotacao/obterListaPorSolicitacaoId/' + id);
        }

        function obterListaCotacoesPorSolicitacoesId(solicitacao) {
            return $http.post(connection.base() + '/cotacao/obterListaCotacoesPorSolicitacoesId', solicitacao);
        }

        function obterListaCotacoesPorUsuarioId(id) {
            return $http.get(connection.base() + '/cotacao/obterListaCotacoesPorUsuarioId/' + id);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            obterPorSolicitacaoId: obterPorSolicitacaoId,
            obterPorProdutoNome: obterPorProdutoNome,
            obterListaCotacoesPorProdutoId: obterListaCotacoesPorProdutoId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            obterCotacaoPorSolicitacaoEUsuario: obterCotacaoPorSolicitacaoEUsuario,
            obterCotacoesPorSolicitacaoEProduto: obterCotacoesPorSolicitacaoEProduto,
            obterListaPorSolicitacaoId: obterListaPorSolicitacaoId,
            obterListaCotacoesPorSolicitacoesId: obterListaCotacoesPorSolicitacoesId,
            obterListaCotacoesPorUsuarioId: obterListaCotacoesPorUsuarioId
        };

        return services;
    }

    angular.module('cotarApp').factory(cotacaoServicesId, ['$http', 'connection', cotacaoServices]);
})();
