(function () {
    'use strict';

    var segmentoServicesId = 'segmentoServices';

    function segmentoServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/segmentos');
        }

        function obterPorId(segmentoId) {
            return $http.get(connection.baseWeb() + '/api/segmentos/' + segmentoId);
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId
        };

        return services;
    }

    angular.module('cotarApp').factory(segmentoServicesId, ['$http', 'connection', segmentoServices]);
})();
