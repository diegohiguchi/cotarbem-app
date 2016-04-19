(function () {
    'use strict';
    var controllerId = 'subSegmento';

    function subSegmento($ionicHistory, $rootScope, $location, services, $ionicModal, $scope, autenticacao, $ionicPopup, load) {
        var vm = this;
        var subSegmentoSelecionado = [];
        vm.subSegmentos = [];
        vm.usuario = autenticacao.getUser();

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterUsuarioLogado() {
            services.usuarioServices.obterPorId(vm.usuario._id).success(function (response) {
                vm.usuario = response.data;
                localStorage.user = JSON.stringify(vm.usuario);
            });
        }

        function obterSegmentos() {
            services.subSegmentoServices.obterTodos().success(function (response) {
                var subSegmentos = response.data;
                vm.subSegmentos = [];

                subSegmentos.forEach(function (subSegmento) {
                    var index = vm.usuario.subSegmentos.indexOf(subSegmento._id);

                    vm.subSegmentos.push({
                        _id: subSegmento._id,
                        nome: subSegmento.nome,
                        subSegmentoSelecionado: index > -1 ? true : false
                    });
                });
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function activate() {
            obterUsuarioLogado();
            obterSegmentos();
            //obterTipoUsuarioLogado();
        }

        function remover(id) {
            load.showLoading('Removendo...');

            services.subSegmentoServices.remover(id).success(function (response) {
                load.hideLoading();
                activate();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.removerSegmentos = function (subSegmento) {
            var confirmPopup = $ionicPopup.confirm({
                title: subSegmento.nome,
                template: 'Deseja remover essa subSegmento?',
                cancelText: 'Cancelar',
                okText: 'Remover'
            });
            confirmPopup.then(function (res) {
                if (res) {
                    //console.log('You are sure');
                    remover(subSegmento._id);
                } else {
                    console.log('You are not sure');
                }
            });
        }

        $ionicModal.fromTemplateUrl('app/subSegmento/remover/subSegmento.remover.html', function (modal) {
            $scope.modal = modal;
        }, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

        /*vm.openModal = function (subSegmento) {
            $scope.subSegmento = subSegmento;
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function () {
            activate();
        });*/

        function adicionarSegmentoUsuario(usuario) {
            services.usuarioServices.adicionarCategoria(usuario).success(function (response) {
                obterUsuarioLogado();
            });
        }

        function removerSegmentosUsuario(usuario) {
            services.usuarioServices.removerSegmentos(usuario).success(function (response) {
                obterUsuarioLogado();
            });
        }

        vm.selecionado = function (subSegmento) {
            var index = subSegmentoSelecionado.indexOf(subSegmento);
            var indexUsuario = vm.usuario.subSegmentos.indexOf(subSegmento._id);
            vm.usuario.subSegmentoId = subSegmento._id;

            if (index > -1 || indexUsuario > -1) {
                removerSegmentosUsuario(vm.usuario);
                subSegmentoSelecionado.splice(index, 1);
                subSegmento.subSegmentoSelecionado = false;
            } else {
                adicionarSegmentoUsuario(vm.usuario);
                subSegmentoSelecionado.push(subSegmento);
                subSegmento.subSegmentoSelecionado = true;
            }
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$ionicHistory', '$rootScope', '$location', 'services', '$ionicModal', '$scope', 'autenticacao', '$ionicPopup', 'load', subSegmento]);

})();
