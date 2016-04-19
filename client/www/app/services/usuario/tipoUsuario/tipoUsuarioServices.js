(function () {
    'use strict';

    var tipoUsuarioServicesId = 'tipoUsuarioServices';

    function tipoUsuarioServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.base() + '/tipoUsuario/obterTodos');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/tipoUsuario/obterPorId/' + id);
        }

        function obterPorNome(nome) {
            return $http.get(connection.base() + '/tipoUsuario/obterPorNome/' + nome);
        }

        function adicionar(tipoUsuario){
            return $http.post(connection.base() + '/tipoUsuario/adicionar', tipoUsuario);
        }

        function editar(tipoUsuario){
            return $http.post(connection.base() + '/tipoUsuario/editar', tipoUsuario);
        }

        function remover(id){
            return $http.post(connection.base() + '/tipoUsuario/remover/'+ id);
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId,
            obterPorNome: obterPorNome,
            adicionar: adicionar,
            editar: editar,
            remover: remover
        };

        return services;
    }

    angular.module('cotarApp').factory(tipoUsuarioServicesId, ['$http', 'connection', tipoUsuarioServices]);
})();
