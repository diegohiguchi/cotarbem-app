(function () {
    'use strict';

    var connectionId = 'connection';

    function connection() {
        var baseDesenvolvimentoApp = 'http://localhost:3000';
        var baseProducaoApp = 'http://cotar-bem.herokuapp.com';
        var baseDesenvolvimentoWeb = 'http://localhost:8080';
        var baseProducaoWeb = 'http://www.cotarbem.com.br';
        var baseHerokuApp = 'http://cotarbem.herokuapp.com';
        var baseNgrok = 'http://008d9a58.ngrok.io/';

        function base() {
            return baseDesenvolvimentoApp;
        }

        function baseWeb() {
            return baseHerokuApp;
        }

        var connections = {
            base: base,
            baseWeb: baseWeb
        };

        return connections;
    }

    angular.module('cotarApp').factory(connectionId, [connection]);
})();