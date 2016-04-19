(function () {
    'use strict';

    var tokenInterceptorsId = 'tokenInterceptor';

    function tokenInterceptor($q, autenticacao) {

        return {
            request: function(config) {
                config.headers = config.headers || {};
                var token = autenticacao.getToken();
                var user = autenticacao.getUser();

                if (token && user) {
                    config.headers['X-Access-Token'] = token.token;
                    config.headers['X-Key'] = user.email;
                    config.headers['Accept'] = "application/json";
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },

            response: function(response) {
                return response || $q.when(response);
            }
        };
    }

    angular.module('cotarApp').factory(tokenInterceptorsId, ['$q', 'autenticacao', tokenInterceptor]);
})();
