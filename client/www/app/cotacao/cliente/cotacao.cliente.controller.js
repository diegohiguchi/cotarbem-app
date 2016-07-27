(function () {
    'use strict';
    var controllerId = 'cotacao.cliente';

    angular.module('cotarApp').controller(controllerId, ['$ionicPopover', '$filter', '$scope', '$ionicModal', 'autenticacao', '$rootScope',
        '$location', 'services', '$state', 'load', '$timeout', '$cordovaCamera', '$ionicPopup', '$ionicHistory', cotacaoCliente]);

    function cotacaoCliente($ionicPopover, $filter, $scope, $ionicModal, autenticacao, $rootScope, $location, services, $state, load,
        $timeout, $cordovaCamera, $ionicPopup, $ionicHistory) {
        var vm = this;
        vm.usuario = autenticacao.getUser();
        vm.procurar = false;
        vm.possuiSolicitacoes = true;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        function mensagemErro(mensagem) {
            load.showLoading(mensagem);

            $timeout(function () {
                load.hideLoading();
            }, 3000);
        }

        function obterListaSolicitacoes(dataInicial, dataFinal) {
            vm.listaSolicitacoes = _.filter(vm.solicitacoes, function (record) {
                return new Date(moment(record.dataCadastro).format('YYYY/MM/DD')).getTime() >= new Date(dataInicial).getTime() &&
                    new Date(moment(record.dataCadastro).format('YYYY/MM/DD')).getTime() <= new Date(dataFinal).getTime();
            });

            if(vm.listaSolicitacoes.length == 0)
                vm.possuiSolicitacoes = false
        }

        function filtrar(dataInicial, dataFinal) {
            load.showLoadingSpinner();
            obterListaSolicitacoes(dataInicial, dataFinal);
            load.hideLoading();
            vm.modal.hide();

        }

        vm.filtrarDatas = function (dataInicial, dataFinal) {
            if (dataInicial == undefined || dataFinal == undefined) {
                mensagemErro('Informe as datas')
                return false;
            }

            if (dataInicial > dataFinal) {
                mensagemErro('Data inicial deve ser menor ou igual a data final');
                return;
            }

            else {
                vm.dataInicial = dataInicial;
                vm.dataFinal = dataFinal;

                filtrar(vm.dataInicial, vm.dataFinal);
            }
        };

        function obterDatas() {
            vm.dataInicial = '2016/06/01';
            vm.dataFinal = new Date();
        }

        vm.limpar = function () {
            obterDatas();
            obterListaSolicitacoes(vm.dataInicial, vm.dataFinal);

            vm.filtroDataInicial = undefined;
            vm.filtroDataFinal = undefined;
        };

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function (popover) {
            vm.popover = popover;
        });

        vm.cotacaoFiltrar = function () {
            vm.popover.hide();
            vm.modal.show();
            vm.procurar = false;
        };

        $ionicModal.fromTemplateUrl('cotacaoFiltro.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.fecharModal = function () {
            vm.modal.hide();
        };

        function obterSolicitacoesPorUsuario(usuarioId) {
            load.showLoadingSpinner();

            services.solicitacaoServices.obterSolicitacoesPorUsuarioId(usuarioId).success(function (response) {
                vm.solicitacoes = response;

                obterDatas();
                filtrar(vm.dataInicial, vm.dataFinal);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        };

        vm.solicitacaoSelecionada = function (solicitacao) {
            if (solicitacao.ativo)
                return vm.showAlert('Cotação em andamento...', solicitacao);

            var solicitacao = angular.toJson({ _id: solicitacao._id });

            $state.go('app.cotacaoClienteProduto', { 'solicitacao': solicitacao });
        };

        vm.showAlert = function (mensagem, solicitacao) {
            var alertPopup = $ionicPopup.alert({
                title: "<i class='fa fa-clock-o'></i> " + solicitacao.subSegmento.nome,
                template: mensagem
            });
            alertPopup.then(function (res) {
                //console.log('Thank you for not eating my delicious ice cream cone');
            });
        };

        function activate() {
            obterSolicitacoesPorUsuario(vm.usuario._id);
        }

        activate();
    }


})();