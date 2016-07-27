(function () {
    'use strict';
    var controllerId = 'usuario.editar';

    angular.module('cotarApp').controller(controllerId, ['$scope', 'connection', '$cordovaFileTransfer', '$location', '$ionicHistory', '$cordovaCamera', '$ionicPopup', 'services', 'autenticacao', 'load', '$state', '$timeout', '$cordovaToast', usuarioEditar]);

    function usuarioEditar($scope, connection, $cordovaFileTransfer, $location, $ionicHistory, $cordovaCamera, $ionicPopup, services, autenticacao, load, $state, $timeout, $cordovaToast) {
        var vm = this;
        vm.mensagem = '';
        //vm.tipoUsuario = [{ tipoUsuarioId: 1, nome: 'Cliente' }, { tipoUsuarioId: 2, nome: 'Fornecedor' }];
        var usuarioId = $state.params.usuarioId;

        vm.voltarPagina = function () {
            $ionicHistory.goBack();
        }

        vm.showPopup = function () {
            vm.myPopup = $ionicPopup.show({
                template: '<button ng-click="vm.tirarFoto()" class="button icon-left ion-camera button-clear button-dark">C&acirc;mera</button>' +
                '<button ng-click="vm.selecionarFoto()" class="button icon-left ion-android-list button-clear button-dark">Documentos</button>',
                title: 'Escolher imagem',
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' },
                ]
            });
        };

        function obterImagem(options) {
            // load.showLoadingSpinner();

            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

                // Destination URL 
                //var url = connection.baseWeb() + "/api/solicitacoes/cliente/uploadImages";
                var url = connection.baseWeb() + "/api/users/editarImagemPerfil";

                //File for Upload
                var targetPath = cordova.file.dataDirectory + sourceFileName;

                // File name only
                var filename = targetPath.split("/").pop();

                var options = {
                    fileKey: "newProfilePicture",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpeg",
                    params: { 'directory': 'upload', 'fileName': filename } // directory represents remote directory,  fileName represents final remote file name
                };

                $cordovaFileTransfer.upload(url, sourcePath, options).then(function (result) {
                    vm.myPopup.close();
                    vm.usuario.profileImageURL = JSON.parse(result.response).message;

                    // var file = JSON.parse(result.response).message.split("./")[1];
                    // vm.file = file;
                    // vm.imagemURL = connection.baseWeb() + "/" + file;

                    // load.hideLoading();
                }, function (err) {
                    console.log("ERROR: " + JSON.stringify(err));
                    // load.hideLoading();
                }, function (progress) {
                    // PROGRESS HANDLING GOES HERE
                });

            }, function (err) {
                console.log(err);
            });
        }

        vm.tirarFoto = function () {
            var options = {
                fileKey: "novaImagemProduto",
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPG,
                targetWidth: 1024,
                targetHeight: 768,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                //correctOrientation: true
            };

            obterImagem(options);
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

            obterImagem(options);
        }

        function salvoComSucesso() {
            load.showLoading('Salvo com sucesso');

            $timeout(function () {
                load.hideLoading();
                $location.path('/app/usuario/detalhar');
            }, 2000);
        }

        function adicionarTipoDocumento(usuario) {
            if (usuario.numeroDocumento.length == 11)
                vm.usuario.tipoDocumento = 'CPF';
            else
                vm.usuario.tipoDocumento = 'CNPJ';
        }

        vm.editarUsuario = function (isValid) {
            if (!isValid)
                return false;

            load.showLoadingSpinner();
            adicionarTipoDocumento(vm.usuario);
            //vm.usuario.profileImageURL = vm.file != undefined ? vm.file : vm.usuario.profileImageURL;

            services.usuarioServices.editar(vm.usuario).success(function (response) {
                localStorage.user = JSON.stringify(response);
                salvoComSucesso();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        // function obterImagemPerfil() {
        //     if (vm.usuario.profileImageURL != undefined && vm.usuario.profileImageURL != '')
        //         vm.imagemURL = connection.baseWeb() + "/" + vm.usuario.profileImageURL;
        // }

        function obterUsuario(usuarioId) {
            load.showLoadingSpinner();
            services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                vm.usuario = response;
                //obterImagemPerfil();
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
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