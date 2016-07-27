(function () {
    'use strict';

    var enderecamentoServicesId = 'enderecamentoServices';

    angular.module('cotarApp').factory(enderecamentoServicesId, ['$http', 'connection', enderecamentoServices]);

    function enderecamentoServices($http, connection) {

        function adicionar(enderecamento) {
            return $http.post(connection.baseWeb() + '/api/enderecamentos', enderecamento);
        }

        function editar(enderecamento) {
            return $http.post(connection.baseWeb() + '/api/enderecamentos/editar', enderecamento);
        }

        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/enderecamentos');
        }

        function obterPorId(enderecamentoId) {
            return $http.get(connection.baseWeb() + '/api/enderecamentos/' + enderecamentoId);
        }

        var services = {
            adicionar: adicionar,
            editar: editar,
            obterTodos: obterTodos,
            obterPorId: obterPorId
        };

        return services;
    }
})();
