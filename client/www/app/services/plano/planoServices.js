(function () {
    'use strict';

    var planoServicesId = 'planoServices';

    function planoServices($http, connection) {
        
        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/planos');
        }

        function obterPorId(id) {
            return $http.get(connection.baseWeb() + '/api/planos/obterPorId/' + id);
        }
        
        var services = {
            obterTodos: obterTodos,
            obterPorId: obterPorId
        };

        return services;
    }

    angular.module('cotarApp').factory(planoServicesId, ['$http', 'connection', planoServices]);
})();
