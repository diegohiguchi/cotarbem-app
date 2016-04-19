(function () {
    'use strict';

    var lanceServicesId = 'lanceServices';

    function lanceServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.base() + '/lance/obterTodos');
        }

        function adicionar(lance){
            return $http.post(connection.base() + '/lance/adicionar', lance);
        }

        function obterListaLancesPorId(lances){
            return $http.post(connection.base() + '/lance/obterListaLancesPorId', lances);
        }

        var services = {
            obterTodos: obterTodos,
            adicionar: adicionar,
            obterListaLancesPorId: obterListaLancesPorId
        };

        return services;
    }

    angular.module('cotarApp').factory(lanceServicesId, ['$http', 'connection', lanceServices]);
})();
