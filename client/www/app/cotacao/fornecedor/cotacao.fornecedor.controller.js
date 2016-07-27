(function () {
    'use strict';
    var controllerId = 'cotacao.fornecedor';

    angular.module('cotarApp').controller(controllerId, ['$timeout', '$ionicPopover', '$ionicModal', '$scope', 'autenticacao', '$rootScope', '$location', 'services', '$state', 'load', '$ionicHistory', cotacaoFornecedor]);

    function cotacaoFornecedor($timeout, $ionicPopover, $ionicModal, $scope, autenticacao, $rootScope, $location, services, $state, load, $ionicHistory) {
        var vm = this;
        vm.usuario = autenticacao.getUser();
        vm.procurar = false;
        vm.possuiSolicitacoes = true;

        if (!$rootScope.isAuthenticated)
            $location.path('/app/login');

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

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

            if (vm.listaSolicitacoes.length == 0)
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

        vm.solicitacaoSelecionada = function (solicitacao) {
            var solicitacao = angular.toJson({ _id: solicitacao._id });

            $state.go('app.cotacaoFornecedorProduto', { 'solicitacao': solicitacao });
        }

        function obterSolicitacoesPorSubSegmentos(usuario) {
            load.showLoadingSpinner();
            services.solicitacaoServices.obterSolicitacoesPorSubSegmentos(usuario.subSegmentos).success(function (response) {
                vm.solicitacoes = response;

                obterDatas();
                filtrar(vm.dataInicial, vm.dataFinal);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function activate() {
            obterSolicitacoesPorSubSegmentos(vm.usuario);
            obterDatas();
        }

        activate();
    }
})();