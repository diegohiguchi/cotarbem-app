(function () {
    'use strict';

    var produtoServicesId = 'produtoServices';

    function produtoServices($http, connection) {

        function obterTodos() {
            // return $http.get(connection.base() + '/produto/obterTodos');
            return $http.get(connection.baseWeb() + '/api/produtos');
        }

        function obterPorId(id) {
            // return $http.get(connection.base() + '/produto/obterPorId/' + id);
            return $http.get(connection.baseWeb() + '/api/produtos/' + id);
        }

        function obterListaProdutosPorId(produtos) {
            return $http.post(connection.base() + '/produto/obterListaProdutosPorId', produtos);
        }

        function adicionarLista(produto){
            // return $http.post(connection.base() + '/produto/adicionar', produto);
            return $http.post(connection.baseWeb() + '/api/produtos/adicionarLista', produto);
        }

        function editar(produto){
            return $http.post(connection.baseWeb() + '/api/produtos/editar', produto);
        }

        function remover(id){
            return $http.post(connection.baseWeb() + '/api/produtos/remover/'+ id);
        }
        
        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId,
            obterListaProdutosPorId: obterListaProdutosPorId,
            editar: editar,
            remover: remover,
            adicionarLista: adicionarLista
        };

        return services;
    }

    angular.module('cotarApp').factory(produtoServicesId, ['$http', 'connection', produtoServices]);
})();
