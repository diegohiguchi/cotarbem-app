(function () {
    'use strict';

    var dashboardServicesId = 'dashboardServices';

    function dashboardServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.base() + '/dashboard/obterTodos');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/dashboard/obterPorId/' + id);
        }

        function obterPorCategoriaId(id) {
            return $http.get(connection.base() + '/dashboard/obterPorCategoriaId/' + id);
        }

        function adicionar(dashboard) {
            return $http.post(connection.base() + '/dashboard/adicionar', dashboard);
        }

        function editar(dashboard) {
            return $http.post(connection.base() + '/dashboard/editar', dashboard);
        }

        function remover(id) {
            return $http.post(connection.base() + '/dashboard/remover/' + id);
        }

        function obterPorNome(nome) {
            return $http.get(connection.base() + '/dashboard/obterPorNome/' + nome);
        }

        function obterListaPorCategoriaId(categorias) {
            return $http.post(connection.base() + '/dashboard/obterListaPorCategoriaId', categorias);
        }

        function obterListaPorSolicitacaoId(solicitacoes) {
            return $http.post(connection.base() + '/dashboard/obterListaPorSolicitacaoId', solicitacoes);
        }

        function obterListaPorUsuarioId(id) {
            return $http.get(connection.base() + '/dashboard/obterListaPorUsuarioId/' + id);
        }

        function obterListaDashboardFornecedoresPorCategoriaId(categorias) {
            return $http.post(connection.base() + '/dashboard/obterListaDashboardFornecedoresPorCategoriaId', categorias);
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId,
            obterPorCategoriaId: obterPorCategoriaId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            obterPorNome: obterPorNome,
            obterListaPorCategoriaId: obterListaPorCategoriaId,
            obterListaPorSolicitacaoId: obterListaPorSolicitacaoId,
            obterListaPorUsuarioId: obterListaPorUsuarioId,
            obterListaDashboardFornecedoresPorCategoriaId: obterListaDashboardFornecedoresPorCategoriaId
        };

        return services;
    }

    angular.module('cotarApp').factory(dashboardServicesId, ['$http', 'connection', dashboardServices]);
})();
