(function () {
    'use strict';
    var controllerId = 'home';

    function home(load, $rootScope, $location, autenticacao, services) {
        var vm = this;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function redirecionarDashboard(tipoUsuario) {
            if (tipoUsuario.nome === 'Fornecedor')
                $location.path('/app/cotacao/dashboard/fornecedor');
            else if (tipoUsuario.nome === 'Cliente')
                $location.path('/app/cotacao/dashboard/cliente');
            else if (tipoUsuario.nome == 'Administrador')
                $location.path('/app/categoria');
        }

        function obterUsuario() {
            load.showLoadingSpinner();
            var usuario = autenticacao.getUser();
             services.usuarioServices.obterPorId(usuario._id).success(function(response){
                vm.usuario = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function(){
                redirecionarDashboard(vm.usuario.tipoUsuario);
            });
        }

        function activate() {
            obterUsuario();
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['load', '$rootScope', '$location', 'autenticacao', 'services', home]);
    ;

})();