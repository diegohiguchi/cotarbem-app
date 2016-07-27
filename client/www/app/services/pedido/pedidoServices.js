(function () {
    'use strict';

    var pedidoServicesId = 'pedidoServices';

    function pedidoServices($http, connection) {
        
        function obterTodos() {
            return $http.get(connection.baseWeb() + '/api/pedidos');
        }

        function adicionar(pedido) {
            return $http.post(connection.baseWeb() + '/api/pedidos', pedido);
        }
        
        var services = {
            obterTodos: obterTodos,
            adicionar: adicionar
        };

        return services;
    }

    angular.module('cotarApp').factory(pedidoServicesId, ['$http', 'connection', pedidoServices]);
})();
