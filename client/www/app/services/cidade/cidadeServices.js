(function () {
    'use strict';

    var cidadeServicesId = 'cidadeServices';

    angular.module('cotarApp').factory(cidadeServicesId, ['$http', 'connection', cidadeServices]);

    function cidadeServices($http, connection) {

        function obterTodas() {
            return $http.get(connection.baseWeb() + '/api/cidades');
        }

        function obterPorId(cidadeId) {
            return $http.get(connection.baseWeb() + '/api/cidades/' + cidadeId);
        }

        var services = {
            obterTodas: obterTodas,
            obterPorId: obterPorId
        };

        return services;
    }
})();
