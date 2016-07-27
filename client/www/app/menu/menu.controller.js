(function () {
    'use strict';
    var controllerId = 'menu';

    angular.module('cotarApp').controller(controllerId, ['socket', '$rootScope', '$location', 'autenticacao', 'services', 'load', '$cordovaBadge', 'connection', menu]);

    function menu(socket, $rootScope, $location, autenticacao, services, load, $cordovaBadge, connection) {
        socket.connect();
        var vm = this;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        // function obterImagem() {
        //     if (vm.usuario.profileImageURL != undefined && vm.usuario.profileImageURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.usuario.profileImageURL;
        // }

        function obterUsuario() {
            vm.usuario = autenticacao.getUser();
            //obterImagem();
            
            vm.usuario.cliente = _.contains(vm.usuario.roles, 'cliente');
            vm.usuario.fornecedor = _.contains(vm.usuario.roles, 'fornecedor');
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

        vm.toggleGroup = function (tipoUsuario) {
            if (vm.isGroupShown(tipoUsuario)) {
                vm.shownGroup = null;
            } else {
                vm.shownGroup = tipoUsuario;
            }
        };

        vm.isGroupShown = function (tipoUsuario) {
            return vm.shownGroup === tipoUsuario;
        };

        function activate() {
            obterUsuario();
        }

        activate();
    }

})();