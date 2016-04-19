(function () {
    'use strict';

    var imagemServicesId = 'imagemServices';

    function imagemServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/imagem/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/imagem/obterPorId/' + id);
        }

        function adicionar(imagem){
            return $http.post(connection.base() + '/imagem/adicionar', imagem);
        }

        function editar(imagem){
            return $http.post(connection.base() + '/imagem/editar', imagem);
        }

        function remover(id){
            return $http.post(connection.base() + '/imagem/remover/'+ id);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover
        };

        return services;
    }

    angular.module('cotarApp').factory(imagemServicesId, ['$http', 'connection', imagemServices]);
})();
