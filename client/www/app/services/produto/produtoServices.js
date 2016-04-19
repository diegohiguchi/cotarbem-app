(function () {
    'use strict';

    var produtoServicesId = 'produtoServices';

    function produtoServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.base() + '/produto/obterTodos');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/produto/obterPorId/' + id);
        }

        function obterListaProdutosPorId(produtos) {
            return $http.post(connection.base() + '/produto/obterListaProdutosPorId', produtos);
        }

        function adicionar(produto){
            return $http.post(connection.base() + '/produto/adicionar', produto);
        }

        function editar(produto){
            return $http.post(connection.base() + '/produto/editar', produto);
        }

        function remover(id){
            return $http.post(connection.base() + '/produto/remover/'+ id);
        }
        
        function adicionarLista(produtos){
            return $http.post(connection.base() + '/produto/adicionarLista', JSON.stringify(produtos));
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId,
            obterListaProdutosPorId: obterListaProdutosPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            adicionarLista: adicionarLista
        };

        return services;
    }

    angular.module('cotarApp').factory(produtoServicesId, ['$http', 'connection', produtoServices]);
})();
