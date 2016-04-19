(function () {
    'use strict';
    var controllerId = 'menu';

    function menu(socket, $rootScope, $location, autenticacao, services, load, $cordovaBadge) {
        socket.connect();
        var vm = this;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
        }

        function limparQuantidadeNotificacoes() {
            $cordovaBadge.promptForPermission();
            $cordovaBadge.hasPermission().then(function (result) {
                $cordovaBadge.set(0);
            }, function (error) {
                console.log(error);
            });
        }

        vm.logout = function () {
            socket.emit('sair', vm.usuario._id);
            load.showLoadingSpinner();
            //limparQuantidadeNotificacoes();
            services.loginServices.logout();
            $rootScope.isAuthenticated = false;
            $location.path('/login');
            localStorage.clear();
            load.hideLoading();
        };

        vm.atualizarImagem = function () {
            obterUsuario();
        }

        function activate() {
            obterUsuario();
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['socket', '$rootScope', '$location', 'autenticacao', 'services', 'load', '$cordovaBadge', menu]);

})();