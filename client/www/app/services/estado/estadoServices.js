(function () {
    'use strict';

    var estadoServicesId = 'estadoServices';

    angular.module('cotarApp').factory(estadoServicesId, ['$http', 'connection', estadoServices]);

    function estadoServices($http, connection) {

        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/estados');
        }

        function obterPorId(estadoId) {
            return $http.get(connection.baseWeb() + '/api/estados/' + estadoId);
        }

        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId
        };

        return services;
    }
})();
