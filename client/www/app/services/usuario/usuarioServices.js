(function () {
    'use strict';

    var usuarioServicesId = 'usuarioServices';

    function usuarioServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.base() + '/usuario/obterTodos');
        }

        function adicionar(usuario){
            return $http.post(connection.base() + '/usuario/adicionar', usuario);
        }

        function editar(usuario){
            return $http.post(connection.base() + '/usuario/editar', usuario);
        }

        function remover(id){
            return $http.post(connection.base() + '/usuario/remover/'+ id);
        }

        function adicionarCategoria(usuario){
            return $http.post(connection.base() + '/usuario/adicionarCategoria', usuario);
        }

        function removerCategoria(usuario){
            return $http.post(connection.base() + '/usuario/removerCategoria', usuario);
        }

        function obterListaUsuariosPorId(usuarios){
            return $http.post(connection.base() + '/usuario/obterListaUsuariosPorId', usuarios);
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/usuario/obterPorId/' + id);
        }

        function obterFornecedoresPorCategoriaId(id) {
            return $http.get(connection.base() + '/usuario/obterFornecedoresPorCategoriaId/' + id);
        }

        var services = {
            obterTodos: obterTodos,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            adicionarCategoria: adicionarCategoria,
            removerCategoria: removerCategoria,
            obterListaUsuariosPorId: obterListaUsuariosPorId,
            obterPorId: obterPorId,
            obterFornecedoresPorCategoriaId: obterFornecedoresPorCategoriaId
        };

        return services;
    }

    angular.module('cotarApp').factory(usuarioServicesId, ['$http', 'connection', usuarioServices]);
})();