(function () {
    'use strict';
    var controllerId = 'denuncia';

    function denuncia(load, $rootScope, $location, autenticacao, services) {
        var vm = this;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
        }

        function obterCotacoes(usuarioId) {
            
        }

        function activate() {
            obterUsuario();
            obterCotacoes(vm.usuario._id);
            //obterSolicitacoesPorUsuario(vm.usuario._id);
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['load', '$rootScope', '$location', 'autenticacao', 'services', denuncia]);
    ;

})();