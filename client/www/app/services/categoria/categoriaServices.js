(function () {
    'use strict';

    var categoriaServicesId = 'categoriaServices';

    function categoriaServices($http, connection) {
        
        function obterTodas() {
            return $http.get(connection.base() + '/categoria/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/categoria/obterPorId/' + id);
        }

        function adicionar(categoria){
            return $http.post(connection.base() + '/categoria/adicionar', categoria);
        }

        function editar(categoria){
            return $http.post(connection.base() + '/categoria/editar', categoria);
        }

        function remover(id){
            return $http.post(connection.base() + '/categoria/remover/' + id);
        }
        
        function obterPorNome(nome) {
            return $http.get(connection.base() + '/categoria/obterPorNome/' + nome);
        }
        
        function obterListaPorCategoriaId(categorias){
            return $http.post(connection.base() + '/categoria/obterListaPorCategoriaId', categorias);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            obterPorNome: obterPorNome,
            obterListaPorCategoriaId: obterListaPorCategoriaId
        };

        return services;
    }

    angular.module('cotarApp').factory(categoriaServicesId, ['$http', 'connection', categoriaServices]);
})();
