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
            // return $http.post(connection.base() + '/usuario/editar', usuario);
            return $http.post(connection.baseWeb() + '/api/users/editar', usuario);
        }

        function remover(id){
            return $http.post(connection.base() + '/usuario/remover/'+ id);
        }

        function removerSubsegmento(usuario){
            return $http.post(connection.baseWeb() + '/api/users/removerSubsegmento', usuario);
        }

        function obterListaUsuariosPorId(usuarios){
            return $http.post(connection.base() + '/usuario/obterListaUsuariosPorId', usuarios);
        }

        function obterPorId(userId) {
            // return $http.get(connection.base() + '/usuario/obterPorId/' + id);
            return $http.get(connection.baseWeb() + '/api/users/' + userId);
        }

        function obterFornecedoresPorCategoriaId(id) {
            return $http.get(connection.base() + '/usuario/obterFornecedoresPorCategoriaId/' + id);
        }

        var services = {
            obterTodos: obterTodos,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            removerSubsegmento: removerSubsegmento,
            obterListaUsuariosPorId: obterListaUsuariosPorId,
            obterPorId: obterPorId,
            obterFornecedoresPorCategoriaId: obterFornecedoresPorCategoriaId
        };

        return services;
    }

    angular.module('cotarApp').factory(usuarioServicesId, ['$http', 'connection', usuarioServices]);
})();