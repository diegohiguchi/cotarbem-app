(function () {
    'use strict';
    var controllerId = 'segmento';

    function segmento($ionicHistory, $rootScope, $location, services, $ionicModal, $scope, autenticacao, $ionicPopup, load) {
        var vm = this;
        var segmentoSelecionado = [];
        vm.segmentos = [];
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
            services.segmentoServices.obterTodos().success(function (response) {
                vm.segmentos = response;
            });
        }

        vm.segmentoSelecionado = function(id){
            $state.go('app.solicitacaoProduto', { 'id': id });
        };

        function activate() {
            obterUsuarioLogado();
            obterSegmentos();
            //obterTipoUsuarioLogado();
        }

        function remover(id) {
            load.showLoading('Removendo...');

            services.segmentoServices.remover(id).success(function (response) {
                load.hideLoading();
                activate();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        // vm.removerSegmentos = function (segmento) {
        //     var confirmPopup = $ionicPopup.confirm({
        //         title: segmento.nome,
        //         template: 'Deseja remover essa segmento?',
        //         cancelText: 'Cancelar',
        //         okText: 'Remover'
        //     });
        //     confirmPopup.then(function (res) {
        //         if (res) {
        //             //console.log('You are sure');
        //             remover(segmento._id);
        //         } else {
        //             console.log('You are not sure');
        //         }
        //     });
        // }

        // $ionicModal.fromTemplateUrl('app/segmento/remover/segmento.remover.html', function (modal) {
        //     $scope.modal = modal;
        // }, {
        //         scope: $scope,
        //         animation: 'slide-in-up'
        //     }).then(function (modal) {
        //         $scope.modal = modal;
        //     });

        /*vm.openModal = function (segmento) {
            $scope.segmento = segmento;
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

        vm.selecionado = function (segmento) {
            var index = segmentoSelecionado.indexOf(segmento);
            var indexUsuario = vm.usuario.segmentos.indexOf(segmento._id);
            vm.usuario.segmentoId = segmento._id;

            if (index > -1 || indexUsuario > -1) {
                removerSegmentosUsuario(vm.usuario);
                segmentoSelecionado.splice(index, 1);
                segmento.segmentoSelecionado = false;
            } else {
                adicionarSegmentoUsuario(vm.usuario);
                segmentoSelecionado.push(segmento);
                segmento.segmentoSelecionado = true;
            }
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$ionicHistory', '$rootScope', '$location', 'services', '$ionicModal', '$scope', 'autenticacao', '$ionicPopup', 'load', segmento]);

})();
