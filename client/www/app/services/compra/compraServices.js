(function () {
    'use strict';

    var compraServicesId = 'compraServices';

    function compraServices($http, connection) {
        
        function obterTodas() {
            return $http.get(connection.baseWeb() + '/api/compras');
        }

        function obterPorUsuarioId(id) {
            return $http.get(connection.baseWeb() + '/api/compras/obterPorUsuarioId/' + id);
        }

        function obterPorFornecedorId(id) {
            return $http.get(connection.baseWeb() + '/api/compras/obterPorFornecedorId/' + id);
        }

        function adicionar(compra) {
            return $http.post(connection.baseWeb() + '/api/compras', compra);
        }
        
        var services = {
            obterPorUsuarioId: obterPorUsuarioId,
            obterPorFornecedorId: obterPorFornecedorId,
            obterTodas: obterTodas,
            adicionar: adicionar
        };

        return services;
    }

    angular.module('cotarApp').factory(compraServicesId, ['$http', 'connection', compraServices]);
})();
