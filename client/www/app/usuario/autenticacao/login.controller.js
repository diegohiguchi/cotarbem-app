(function () {
    'use strict';
    var controllerId = 'login';

    angular.module('cotarApp').controller(controllerId, ['connection', '$cordovaFileTransfer', '$scope', '$rootScope', '$location', 'services', 'autenticacao', 'load',
        '$timeout', '$ionicPush', '$ionicUser', '$cordovaCamera', '$ionicPopup', '$ionicScrollDelegate', '$ionicModal', login]);

    function login(connection, $cordovaFileTransfer, $scope, $rootScope, $location, services, autenticacao, load, $timeout, $ionicPush,
        $ionicUser, $cordovaCamera, $ionicPopup, $ionicScrollDelegate, $ionicModal) {
        var vm = this;
        vm.viewLogin = false;
        vm.viewRegistro = false;
        vm.campoObrigatorioTipoUsuario = false;
        vm.pedido = {};
        vm.tipoUsuario = [{ _id: 1, nome: 'Cliente' }, { _id: 2, nome: 'Fornecedor' }];
        vm.usuario = {
            email: '',
            password: '',
            //urlImagem: '',
            //endereco: {}, 
            tipoUsuario: []
        };

        $rootScope.$on('$cordovaPush:tokenReceived', function (event, data) {
            console.log('Got token', data.token, data.platform);
            adicionarDeviceToken(data.token);
        });

        // function redirecionarHome(tipoUsuario) {
        //     // services.tipoUsuarioServices.obterPorId(tipoUsuarioId).success(function (response) {
        //     //     tipoUsuario = response.data;
        //     // }).then(function () {
        //     if (tipoUsuario.nome === 'Fornecedor')
        //         $location.path('/app/cotacao/dashboard/fornecedor');
        //     else if (tipoUsuario.nome === 'Cliente')
        //         $location.path('/app/cotacao/dashboard/cliente');
        //     else if (tipoUsuario.nome == 'Administrador')
        //         $location.path('/app/tipoUsuario');
        //     // });

        //     //load.hideLoading();
        // }

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

        /*function editarDeviceToken(device) {
         services.deviceServices.editar(device).success(function (response) {
         });
         }

         function obterDeviceToken(response) {
         var tokenAndroid = deviceToken.getDeviceToken();

         if (tokenAndroid) {
         var device = {
         usuarioId: response.user._id,
         token: tokenAndroid
         }

         editarDeviceToken(device);
         }

         }*/

        function adicionarDeviceToken(token) {
            var usuario = autenticacao.getUser();
            var device = {
                user: usuario._id,
                token: token
            }

            services.deviceServices.adicionar(device).then(function (response) {
                // deviceToken.setDeviceToken(appDeviceToken);
                // deviceToken.setToken({
                //     token: response.token,
                //     expires: response.expires
                // });
                //alert('registered!');
            });

            load.hideLoading();
        }

        function obterDeviceToken() {
            //Basic registration
            //vm.pushRegister = function() {
            //alert('Registering...');

            $ionicPush.register({
                canShowAlert: false,
                onNotification: function (notification) {
                    // Called for each notification for custom handling
                    vm.lastNotification = JSON.stringify(notification);
                }
            }).then(function (deviceToken) {
                console.log(deviceToken);
            });
            //}
        }

        function identificarUsuario() {
            //alert('Identifying');
            console.log('Identifying user');

            var user = $ionicUser.get();
            if (!user.user_id) {
                // Set your user_id here, or generate a random one
                user.user_id = $ionicUser.generateGUID()
            }

            angular.extend(user, {
                name: 'Test User',
                message: 'I come from planet Ion'
            });

            $ionicUser.identify(user);
        }

        vm.login = function (usuario) {
            load.showLoadingSpinner();

            services.loginServices.login(usuario).success(function (response) {
                autenticacao.setUser(response);
                autenticacao.setToken({
                    token: response.token,
                    expires: response.expires
                });

                $rootScope.isAuthenticated = true;

                //obterDeviceToken(response);
                identificarUsuario();
                obterDeviceToken();

                $location.path('/app/home');
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
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

        vm.showPopupTipoUsuario = function () {

            var myPopup = $ionicPopup.show({
                template: '<div class="list list_categoria" ng-repeat="tipoUsuario in vm.tipoUsuario" ng-click="vm.selecionado(tipoUsuario)">' +
                '<div class="tipoUsuario">' +
                '<label class="checkbox">' +
                '<input type="checkbox" ng-model="tipoUsuario.selecionado"></input>' +
                '</label><span class="tipoUsuario-nome">{{ tipoUsuario.nome }}</span></div></div>' +
                '<div class="clear" ng-show="!!vm.campoObrigatorioTipoUsuario">' +
                '<span class="alert-error-tipoUsuario">' +
                '<i class="fa fa-exclamation-triangle"></i>' +
                'Selecione o Tipo de Usuário' +
                '</span>' +
                '</div>',
                title: 'Selecione o Tipo de Usuário',
                scope: $scope,
                buttons: [
                    { text: 'Cancelar' },
                    {
                        text: '<b>Ok</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!_.find(vm.tipoUsuario, { selecionado: true })) {
                                vm.campoObrigatorioTipoUsuario = true;
                                e.preventDefault();
                            } else {
                                return vm.campoObrigatorioTipoUsuario = false;
                            }
                        }
                    }
                ]
            });
        };

        vm.selecionado = function (tipoUsuario) {
            var index = vm.usuario.tipoUsuario.indexOf(tipoUsuario.nome);

            if (index > -1) {
                vm.usuario.tipoUsuario.splice(index, 1);
                tipoUsuario.selecionado = false;
            } else {
                vm.usuario.tipoUsuario.push(tipoUsuario.nome);
                tipoUsuario.selecionado = true;
                vm.campoObrigatorioTipoUsuario = false;
            }
        }

        function adicionarTipoDocumento(usuario) {
            if (usuario.numeroDocumento.length == 11)
                vm.usuario.tipoDocumento = 'CPF';
            else
                vm.usuario.tipoDocumento = 'CNPJ';
        }

        function adicionarRegrasTipoUsuario(usuario) {
            vm.usuario.roles = [];

            usuario.tipoUsuario.forEach(function (tipoUsuario) {
                vm.usuario.roles.push(tipoUsuario.toLowerCase());
            });
        }

        function adicionarPedidoPlanoGratuito(usuario) {
            var data = new Date();

            vm.pedido.dataVencimento = data.setDate(data.getDate() + vm.planoGratuito.quantidadeDias);
            vm.pedido.status = 0; //Gratuito
            vm.pedido.plano = vm.planoGratuito._id;
            vm.pedido.user = usuario._id;

            services.pedidoServices.adicionar(vm.pedido).success(function (response) {

            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                autenticacao.setUser(usuario);
                autenticacao.setToken({
                    token: usuario.token,
                    expires: usuario.expires
                });

                $rootScope.isAuthenticated = true;

                identificarUsuario();
                obterDeviceToken();
                $location.path('/app/home');
            });
        }

        vm.registrar = function (usuario) {
            if (vm.mensagem != undefined)
                return;

            load.showLoadingSpinner();
            adicionarTipoDocumento(vm.usuario);
            adicionarRegrasTipoUsuario(vm.usuario);
            //usuario.endereco = adicionarEndereco(usuario);

            services.loginServices.registrar(usuario).success(function (response) {
                adicionarPedidoPlanoGratuito(response);

                // autenticacao.setUser(response);
                // autenticacao.setToken({
                //     token: response.token,
                //     expires: response.expires
                // });

                // $rootScope.isAuthenticated = true;

                // //obterDeviceToken(response);
                //identificarUsuario();
                // obterDeviceToken();
                // //redirecionarHome(response.user.tipoUsuario);
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
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

        function obterImagem(options) {
            $cordovaCamera.getPicture(options).then(function (sourcePath) {
                //var sourceDirectory = sourcePath.substring(0, sourcePath.lastIndexOf('/') + 1);
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);

                // Destination URL
                //var url = connection.baseWeb() + "/api/solicitacoes/cliente/uploadImages";
                var url = connection.baseWeb() + "/api/users/picture";

                //File for Upload
                var targetPath = cordova.file.dataDirectory + sourceFileName;

                // File name only
                var filename = targetPath.split("/").pop();

                var options = {
                    //fileKey: "novaImagemProduto",
                    fileKey: "newProfilePicture",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpeg",
                    params: { 'directory': 'upload', 'fileName': filename } // directory represents remote directory,  fileName represents final remote file name
                };

                $cordovaFileTransfer.upload(url, sourcePath, options).then(function (result) {
                    console.log("SUCCESS: " + JSON.stringify(result.response));
                    var file = JSON.parse(result.response).message.split(".")[1];
                    vm.usuario.urlImagem = connection.baseWeb() + file;
                }, function (err) {
                    console.log("ERROR: " + JSON.stringify(err));
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


        vm.retirarImagem = function () {
            if (vm.usuario.urlImagem != undefined) {
                $cordovaCamera.cleanup();
                vm.usuario.urlImagem = '';
            }
        }

        $ionicModal.fromTemplateUrl('formEsqueceuSenha.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.abrirModalEsqueceuSenha = function () {
            vm.modal.show();
        };

        vm.fecharModalEsqueceuSenha = function () {
            vm.modal.hide();
        };

        function enviadoComSucesso() {
            load.showLoading('Solicita&ccedil;&atilde;o enviada com sucesso, verifique seu e-mail.');

            $timeout(function () {
                load.hideLoading();
            }, 3000);
        }

        vm.enviarSenha = function (usuario) {
            load.showLoadingSpinner();
            services.loginServices.resetPassword(usuario).success(function (response) {
                enviadoComSucesso();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function obterPlanos() {
            services.planoServices.obterTodos().success(function (response) {
                vm.planos = response;
                vm.planoGratuito = _.find(vm.planos, { nome: 'Gratuito' });
            });
        }

        function activate() {
            obterPlanos();
        }

        activate();
    }

})();