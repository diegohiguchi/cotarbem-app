(function () {
    'use strict';
    var controllerId = 'subSegmento';

    angular.module('cotarApp').controller(controllerId, ['$state', '$ionicHistory', '$rootScope', '$location', 'services', '$ionicModal', '$scope', 'autenticacao', '$ionicPopup', 'load', subSegmento]);

    function subSegmento($state, $ionicHistory, $rootScope, $location, services, $ionicModal, $scope, autenticacao, $ionicPopup, load) {
        var vm = this;
        var subSegmentoSelecionado = [];
        vm.subSegmentos = [];
        vm.usuario = autenticacao.getUser();
        var segmentoId = $state.params.segmentoId;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function obterUsuarioLogado() {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(vm.usuario._id).success(function (response) {
                vm.usuario = response;
                localStorage.user = JSON.stringify(vm.usuario);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterSubsegmentosPorSegmentoId(segmentoId) {
            load.showLoadingSpinner();
            services.subSegmentoServices.obterSubsegmentosPorSegmentoId(segmentoId).success(function (response) {
                var subSegmentos = response;
                vm.subSegmentos = [];

                subSegmentos.forEach(function (subSegmento) {
                    var index = vm.usuario.subSegmentos.indexOf(subSegmento._id);

                    vm.subSegmentos.push({
                        _id: subSegmento._id,
                        nome: subSegmento.nome,
                        subSegmentoSelecionado: index > -1 ? true : false
                    });
                });

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
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

        vm.removerSubsegmentos = function (subSegmento) {
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

        // $ionicModal.fromTemplateUrl('app/subSegmento/remover/subSegmento.remover.html', function (modal) {
        //     $scope.modal = modal;
        // }, {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function (modal) {
        //         $scope.modal = modal;
        //     });

        /*vm.openModal = function (subSegmento) {
            $scope.subSegmento = subSegmento;
            $scope.modal.show();
        };

        $scope.$on('modal.hidden', function () {
            activate();
        });*/

        function adicionarSubsegmentoUsuario(usuario) {
            load.showLoadingSpinner();
            services.usuarioServices.editar(usuario).success(function (response) {
                obterUsuarioLogado();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function removerSubsegmentoUsuario(usuario) {
            load.showLoadingSpinner();
            services.usuarioServices.removerSubsegmento(usuario).success(function (response) {
                obterUsuarioLogado();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.selecionado = function (subSegmento) {
            var index = subSegmentoSelecionado.indexOf(subSegmento);
            var indexUsuario = vm.usuario.subSegmentos.indexOf(subSegmento._id);
            vm.usuario.subSegmentos = subSegmento._id;

            if (index > -1 || indexUsuario > -1) {
                removerSubsegmentoUsuario(vm.usuario);
                subSegmentoSelecionado.splice(index, 1);
                subSegmento.subSegmentoSelecionado = false;
            } else {
                adicionarSubsegmentoUsuario(vm.usuario);
                subSegmentoSelecionado.push(subSegmento);
                subSegmento.subSegmentoSelecionado = true;
            }
        }

        function activate() {
            obterUsuarioLogado();
            obterSubsegmentosPorSegmentoId(segmentoId);
        }

        activate();
    }

})();
