(function () {
    'use strict';
    var controllerId = 'usuario.editar.enderecamento';

    angular.module('cotarApp').controller(controllerId, ['connection', '$cordovaFileTransfer', '$location', '$ionicHistory', '$cordovaCamera', '$ionicPopup', 'services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioEditarEnderecamento]);

    function usuarioEditarEnderecamento(connection, $cordovaFileTransfer, $location, $ionicHistory, $cordovaCamera, $ionicPopup, services, autenticacao, load, $state, $timeout, $cordovaToast) {
        var vm = this;
        vm.mensagem = '';
        //vm.tipoUsuario = [{ tipoUsuarioId: 1, nome: 'Cliente' }, { tipoUsuarioId: 2, nome: 'Fornecedor' }];
        var usuarioId = $state.params.usuarioId;

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        // vm.buscarCep = function (cep) {
        //     if (cep == undefined) {
        //         vm.usuario.endereco = {};
        //         vm.usuario.cep = '';
        //         vm.mensagem = '';
        //         return;
        //     }

        //     load.showLoadingSpinner();
        //     services.localizacaoServices.obterCep(cep).success(function (response) {
        //         vm.mensagem = '';
        //         vm.usuario.endereco = response.data;
        //         load.hideLoading();
        //     }).error(function (err, statusCode) {
        //         vm.usuario.endereco = {};
        //         vm.mensagem = err.message;
        //         load.hideLoading();
        //     });
        // }

        vm.showPopup = function () {
            var myPopup = $ionicPopup.show({
                //templateUrl: 'popupImagem.html',
                title: 'Escolher imagem',
                cssClass: '.popup-buttons .button',
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: 'C&acirc;mera',
                    type: 'button icon-left ion-camera button-clear button-dark',
                    onTap: function (e) {
                        // e.preventDefault() will stop the popup from closing when tapped.
                        return vm.tirarFoto();
                    }
                }, {
                        text: 'Documentos',
                        type: 'button icon-left ion-android-list button-clear button-dark',
                        onTap: function (e) {
                            // Returning a value will cause the promise to resolve with the given value.
                            return vm.selecionarFoto();
                        }
                    }]
            });
        };

        function editadoComSucesso() {
            load.showLoading('Usuário editado com sucesso.');

            $timeout(function () {
                load.hideLoading();
                $location.path('/app/usuario/detalhar');
            }, 2000);
        }

        function adicionarEndereco(usuario) {
            return {
                cep: usuario.cep,
                logradouro: usuario.endereco.logradouro,
                bairro: usuario.endereco.bairro,
                cidade: usuario.endereco.cidade,
                estado: usuario.endereco.estado,
                numero: usuario.numero
            }
        }

        function salvoComSucesso() {
            load.showLoading('Salvo com sucesso');

             $timeout(function () {
                load.hideLoading();
                $location.path('/app/usuario/detalhar');
            }, 2000);
        }

        function atualizarUsuario(usuario) {
            services.usuarioServices.editar(usuario).success(function (response) {
                localStorage.user = JSON.stringify(response);
                salvoComSucesso();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.salvarEndrecamento = function (isValid) {
            if (!isValid)
                return false;

            if (vm.enderecamento._id) {
                services.enderecamentoServices.editar(vm.enderecamento).success(function (response) {
                    salvoComSucesso();
                });
            } else {
                vm.enderecamento.user = vm.usuario._id;

                services.enderecamentoServices.adicionar(vm.enderecamento).success(function (response) {
                    vm.enderecamento = response;
                    vm.usuario.enderecamento = response._id;

                    atualizarUsuario(vm.usuario);
                });
            }
        };

        // vm.editarUsuario = function (usuario) {
        //     if (vm.mensagem != '')
        //         return;

        //     load.showLoadingSpinner();
        //     usuario.endereco = adicionarEndereco(usuario);

        //     services.usuarioServices.editar(usuario).success(function (response) {
        //         localStorage.user = JSON.stringify(response.data);
        //         editadoComSucesso();
        //     }).error(function (err, statusCode) {
        //         load.hideLoading();
        //         load.toggleLoadingWithMessage(err.message);
        //     });
        // }


        vm.filtrarCidadesPorEstado = function (modelEstado) {
            vm.cidades = [];

            if (modelEstado === undefined)
                return;

            vm.listaCidades.forEach(function (cidade) {
                if (cidade.estado._id === modelEstado._id) {
                    vm.cidades.push(cidade);
                    vm.cidades = _.sortBy(vm.cidades, function (cidade) { return cidade.nome });
                }
            });

            if (vm.usuario.enderecamento != undefined)
                vm.enderecamento.cidade = _.find(vm.cidades, { _id: vm.usuario.enderecamento.cidade._id });
        };

        function obterEndereco(enderecamento) {
            enderecamento.estado = _.find(vm.estados, { _id: enderecamento.cidade.estado._id });
            vm.filtrarCidadesPorEstado(enderecamento.estado);
        }

        function obterCidades() {
            services.cidadeServices.obterTodas().success(function (response) {
                vm.listaCidades = response;

                if (!_.isEmpty(vm.enderecamento))
                    obterEndereco(vm.enderecamento);

                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterEstados() {
            services.estadoServices.obterTodos().success(function (response) {
                vm.estados = _.sortBy(response, function (estado) { return estado.nome });
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                obterCidades();
            });
        }

        function obterUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                vm.usuario = response;
                vm.enderecamento = vm.usuario.enderecamento != undefined ? vm.usuario.enderecamento : {};
                //load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                obterEstados();
            });
        }

        function activate() {
            obterUsuario(usuarioId);
        }

        activate();
    }

})();

// (function () {
//     'use strict';
//     var controllerId = 'usuario.editar';
// 
//     function usuarioEditarEnderecamento(services, autenticacao, load, $state, $timeout, $cordovaToast) {
//         var vm = this;
//         var tipoUsuario = {};
//         var localizacoes = [];
//         vm.localizacoes = [];
//         vm.usuario = $state.params.usuario != '' ? angular.fromJson($state.params.usuario) : '';
//         var localizacao = $state.params.localizacao != '' ? angular.fromJson($state.params.localizacao) : '';
// 
//         function obterLocalizacoes() {
//             load.showLoadingSpinner();
//             if (vm.usuario.localizacoes != undefined && vm.usuario.localizacoes.length > 0) {
//                 services.localizacaoServices.obterListaLocalizacoesPorId(vm.usuario.localizacoes).success(function (response) {
//                     var localizacoes = response.data;
// 
//                     localizacoes.forEach(function (localizacao) {
//                         vm.localizacoes.push({
//                             _id: localizacao._id,
//                             endereco: localizacao.endereco,
//                             latitude: localizacao.latitude,
//                             longitude: localizacao.longitude
//                         });
//                     });
//                     load.hideLoading();
//                 });
//             } else
//                 load.hideLoading();
//         }
// 
//         vm.adicionarEndereco = function () {
//             load.showLoadingSpinner();
// 
//             var usuario = angular.toJson(vm.usuario);
// 
//             $state.go('app.usuarioLocalizacao', {'usuario': usuario});
//             load.hideLoading();
//         }
// 
//         vm.salvarDados = function (usuario) {
//             load.showLoadingSpinner();
//             services.localizacaoServices.adicionarListaLocalizacoes(vm.localizacoes).success(function (response) {
//                 localizacoes = response.data;
//             }).then(function () {
//                 usuario.localizacoes = _.pluck(localizacoes, '_id');
//                 services.usuarioServices.editar(usuario).success(function (response) {
//                     vm.usuario = '';
//                     limparLocalizacoesLocalStorage();
//                     load.toggleLoadingWithMessage('Salvo com sucesso');
//                     $timeout(function () {
//                         $state.go('app.usuario');
//                     }, 2000);
//                 }).error(function (err, statusCode) {
//                     load.hideLoading();
//                     load.toggleLoadingWithMessage(err.message);
//                 });
//             });
//         }
// 
//         function obterLocalizacoesLocalStorage() {
//             if (localizacao != '') {
//                 localStorage.setItem('localizacaoEditar= ' + localizacao.endereco, JSON.stringify(localizacao));
//             }
// 
//             for (var i = 0; i < localStorage.length; i++) {
//                 var key = localStorage.key(i).split('=', 1).shift();
// 
//                 if (key == 'localizacaoEditar') {
//                     var key = localStorage.key(i);
//                     var value = localStorage[key];
//                     vm.localizacoes.push(JSON.parse(value));
//                 }
//             }
//         }
// 
//         function limparLocalizacoesLocalStorage() {
//             if (vm.localizacoes.length > 0) {
//                 for (var i = 0; i < vm.localizacoes.length; i++) {
//                     localStorage.removeItem(localStorage.getItem('localizacaoEditar= ' + vm.localizacoes[i].endereco));
//                 }
//             }
// 
//             vm.localizacoes = '';
//         }
// 
//         function activate() {
//             obterLocalizacoes();
//             obterLocalizacoesLocalStorage();
//         }
// 
//         activate();
//     }
// 
//     angular.module('cotarApp').controller(controllerId, ['services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioEditarEnderecamento]);
// 
// })();