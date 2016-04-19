(function () {
    'use strict';

    var localizacaoServicesId = 'localizacaoServices';

    function localizacaoServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.base() + '/localizacao/obterTodas');
        }

        function obterPorId(id) {
            return $http.get(connection.base() + '/localizacao/obterPorId/' + id);
        }

        function adicionar(localizacao){
            return $http.post(connection.base() + '/localizacao/adicionar', localizacao);
        }

        function editar(localizacao){
            return $http.post(connection.base() + '/localizacao/editar', localizacao);
        }

        function remover(id){
            return $http.post(connection.base() + '/localizacao/remover/'+ id);
        }

        function obterListaLocalizacoesPorId(localizacoes){
            return $http.post(connection.base() + '/localizacao/obterListaLocalizacoesPorId', localizacoes);
        }

        function adicionarListaLocalizacoes(localizacoes){
            return $http.post(connection.base() + '/localizacao/adicionarListaLocalizacoes', localizacoes);
        }
        
        function obterCep(cep){
            return $http.get(connection.base() + '/localizacao/obterCep/' + cep);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId,
            adicionar: adicionar,
            editar: editar,
            remover: remover,
            obterListaLocalizacoesPorId: obterListaLocalizacoesPorId,
            adicionarListaLocalizacoes: adicionarListaLocalizacoes,
            obterCep: obterCep
        };

        return services;
    }

    angular.module('cotarApp').factory(localizacaoServicesId, ['$http', 'connection', localizacaoServices]);
})();
