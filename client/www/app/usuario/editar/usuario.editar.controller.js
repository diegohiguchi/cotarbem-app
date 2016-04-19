(function () {
    'use strict';
    var controllerId = 'usuario.editar';

    function usuarioEditar($cordovaFile, $location, $ionicHistory, $cordovaCamera, $ionicPopup, services, autenticacao, load, $state, $timeout, $cordovaToast) {
        var vm = this;
        vm.mensagem = '';
        vm.tipoUsuario = [{ tipoUsuarioId: 1, nome: 'Cliente' }, { tipoUsuarioId: 2, nome: 'Fornecedor' }];
        vm.usuario = angular.fromJson($state.params.usuario);

        // function obterTodosTiposUsuarios() {
        //     load.showLoadingSpinner();
        //     services.tipoUsuarioServices.obterTodos().success(function (response) {
        //         vm.tipoUsuario = _.reject(response.data, function (usuario) { return usuario.nome == 'Administrador'; });
        //         load.hideLoading();
        //     }).error(function (err, statusCode) {
        //         load.hideLoading();
        //         load.toggleLoadingWithMessage(err.message);
        //     });
        // }

        vm.buscarCep = function (cep) {
            if (cep == undefined) {
                vm.usuario.endereco = {};
                vm.usuario.cep = '';
                vm.mensagem = '';
                return;
            }

            load.showLoadingSpinner();
            services.localizacaoServices.obterCep(cep).success(function (response) {
                vm.mensagem = '';
                vm.usuario.endereco = response.data;
                load.hideLoading();
            }).error(function (err, statusCode) {
                vm.usuario.endereco = {};
                vm.mensagem = err.message;
                load.hideLoading();
            });
        }

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

        vm.tirarFoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
               
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
                    vm.usuario.urlImagem = cordova.file.dataDirectory + sourceFileName;
                }, function (error) {
                    console.dir(error);
                });

            }, function (err) {
                console.log(err);
            });
        }

        vm.selecionarFoto = function () {
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
               
                $cordovaFile.copyFile(sourceDirectory, sourceFileName, cordova.file.dataDirectory, sourceFileName).then(function (success) {
                    vm.usuario.urlImagem = cordova.file.dataDirectory + sourceFileName;
                }, function (error) {
                    console.dir(error);
                });

            }, function (err) {
                console.log(err);
            });
        }

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

        vm.editarUsuario = function (usuario) {
            if (vm.mensagem != '')
                return;

            load.showLoadingSpinner();
            usuario.endereco = adicionarEndereco(usuario);

            services.usuarioServices.editar(usuario).success(function (response) {
                localStorage.user = JSON.stringify(response.data);
                editadoComSucesso();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        function activate() {
            //obterTodosTiposUsuarios();
        }

        activate();
    }

    angular.module('cotarApp').controller(controllerId, ['$cordovaFile', '$location', '$ionicHistory', '$cordovaCamera', '$ionicPopup', 'services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioEditar]);

})();

// (function () {
//     'use strict';
//     var controllerId = 'usuario.editar';
// 
//     function usuarioEditar(services, autenticacao, load, $state, $timeout, $cordovaToast) {
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
//     angular.module('cotarApp').controller(controllerId, ['services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioEditar]);
// 
// })();