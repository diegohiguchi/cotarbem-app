(function () {
    'use strict';

    var subSegmentoServicesId = 'subSegmentoServices';

    function subSegmentoServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/subSegmentos');
        }

        function obterPorId(subsegmentoId) {
            return $http.get(connection.baseWeb() + '/api/subSegmentos/' + subsegmentoId);
        }

        function obterSubsegmentosPorSegmentoId(segmentoId) {
            return $http.get(connection.baseWeb() + '/api/subsegmentos/listarSubsegmentosPorSegmentoId/' + segmentoId);
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId,
            obterSubsegmentosPorSegmentoId: obterSubsegmentosPorSegmentoId
        };

        return services;
    }

    angular.module('cotarApp').factory(subSegmentoServicesId, ['$http', 'connection', subSegmentoServices]);
})();
