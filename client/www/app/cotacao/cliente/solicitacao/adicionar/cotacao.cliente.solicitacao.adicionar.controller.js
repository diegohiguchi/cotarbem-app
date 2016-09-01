(function () {
    'use strict';
    var controllerId = 'cotacao.cliente.solicitacao.adicionar';

    angular.module('cotarApp').controller(controllerId, ['$cordovaBarcodeScanner', '$cordovaFile', 'connection', '$cordovaFileTransfer', 'socket',
        '$ionicPopup', '$location', '$timeout', '$scope', '$ionicModal', 'services', 'autenticacao', 'load', '$state',
        '$ionicHistory', '$cordovaCamera', cotacaoClienteSolicitacaoAdicionar]);

    function cotacaoClienteSolicitacaoAdicionar($cordovaBarcodeScanner, $cordovaFile, connection, $cordovaFileTransfer, socket, $ionicPopup, $location, $timeout, $scope,
        $ionicModal, services, autenticacao, load, $state, $ionicHistory, $cordovaCamera) {
        socket.connect();
        var vm = this;
        var edicaoItem = {};
        var produtosId = [];
        vm.produtos = [];
        vm.mensagem = '';
        vm.usuario = autenticacao.getUser();
        vm.cadastro = [];
        //vm.file = '';
        vm.solicitacao = {};

        function obterSegmentos() {
            load.showLoadingSpinner();
            services.segmentoServices.obterTodos().success(function (response) {
                vm.segmentos = _.sortBy(response, function (segmento) { return segmento.nome });
                // load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                obterSubSegmentos();
            });
        }

        function obterSubSegmentos() {
            // load.showLoadingSpinner();
            services.subSegmentoServices.obterTodos().success(function (response) {
                vm.listaSubSegmentos = response;
                load.hideLoading();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        vm.filtrarSubSegmentosPorSegmento = function (modelSegmento) {
            vm.subSegmentos = [];

            if (modelSegmento === undefined)
                return;

            vm.listaSubSegmentos.forEach(function (subSegmento) {
                if (subSegmento.segmento._id === modelSegmento._id) {
                    vm.subSegmentos.push(subSegmento);
                    vm.subSegmentos = _.sortBy(vm.subSegmentos, function (subSegmento) { return subSegmento.nome });
                }
            });
        };

        vm.buscarCodigoBarras = function () {
            $cordovaBarcodeScanner.scan().then(function (imageData) {
                vm.codigoBarras = imageData.text;

                // console.log("Text -> " + imageData.text);
                // console.log("Barcode Format -> " + imageData.format);
                // console.log("Cancelled -> " + imageData.cancelled);
            }, function (error) {
                //console.log("An error happened -> " + error);
            });
        };

        function limparCampos() {
            vm.imagemURL = '';
            vm.codigoBarras = '';
        }

        vm.cadastrarItem = function (item, form) {
            var indexProduto = vm.produtos.indexOf(item);

            if (indexProduto != -1) {
                item.imagemURL = vm.imagemURL;
                item.codigo = vm.codigoBarras;
                vm.produtos[indexProduto] = item;
            } else {
                vm.produtos.push({
                    nome: item.nome,
                    imagemURL: vm.imagemURL,
                    codigo: vm.codigoBarras,
                    unidadeMedida: item.unidadeMedida,
                    quantidade: item.quantidade,
                    dataEntrega: item.dataEntrega,
                    observacao: item.observacao
                });
            }

            vm.fecharModalSolicitacaoCadastroItem();
            form.$submitted = false;
            vm.cadastro = [];
            //vm.file = '';
            vm.mensagem = '';
        }

        function vincularProdutosNaSolicitacao(solicitacao, produtosId) {
            return {
                user: vm.usuario._id,
                segmento: solicitacao.segmento,
                subSegmento: solicitacao.subSegmento,
                tempo: solicitacao.tempo,
                produtos: produtosId
            }
        }

        function adicionadoComSucesso() {
            load.showLoading('Solicita&ccedil;&atilde;o enviada com sucesso');

            $timeout(function () {
                $state.go('app.cotacaoCliente');

                load.hideLoading();
            }, 3000);
        }

        function notificarDevices(subSegmento) {
            var device = {
                titulo: 'Cotar Bem',
                mensagem: 'Nova solicitação',
                subSegmento: subSegmento
            }

            services.deviceServices.notificarPorSubSegmento(device).success(function (response) {
                adicionadoComSucesso();
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            });
        }

        function notificarEmailFornecedores(solicitacao, callback) {
            var novaSolicitacao = {};
            novaSolicitacao = solicitacao;
            socket.emit('nova-solicitacao', novaSolicitacao);
            services.notificacaoServices.notificarFornecedores(solicitacao).success(function (response) {
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function () {
                callback(solicitacao.subSegmento);
            });
        }

        function adicionarSolicitacao(produtosId) {
            var solicitacaoProdutos = vincularProdutosNaSolicitacao(vm.solicitacao, produtosId);

            services.solicitacaoServices.solicitar(solicitacaoProdutos).success(function (response) {
            }).error(function (err, statusCode) {
                load.hideLoading();
                load.toggleLoadingWithMessage(err.message);
            }).then(function (response) {
                notificarEmailFornecedores(response.data, notificarDevices);
            });
        }

        function adicionarListaProdutos(listaProdutos) {
            services.produtoServices.adicionarLista(listaProdutos).success(function (response) {
                produtosId = _.pluck(response, '_id');
            }).then(function () {
                adicionarSolicitacao(produtosId);
            });
        }

        vm.salvarSolicitacao = function (solicitacao, listaProdutos) {
            if (listaProdutos == undefined || listaProdutos.length <= 0) {
                vm.mensagem = 'Adicione pelo menos um item para cotação';
                return;
            }

            load.showLoadingSpinner();
            adicionarListaProdutos(listaProdutos);
        }

        vm.editarItem = function (item) {
            vm.abrirModalSolicitacaoCadastroItem(item);
        }

        $ionicModal.fromTemplateUrl('solicitacaoCadastroItem.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.modal = modal;
        });

        vm.abrirModalSolicitacaoCadastroItem = function (item) {
            if (item !== undefined) {
                vm.cadastro = item;
                vm.imagemURL = item.imagemURL;
                vm.codigoBarras = item.codigo;
            } else {
                vm.cadastro = [];
            }

            vm.modal.show();
        };

        vm.fecharModalSolicitacaoCadastroItem = function () {
            vm.modal.hide();
            limparCampos();
        };

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
                var sourceFileName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1, sourcePath.length);
                var url = connection.baseWeb() + "/api/solicitacoes/cliente/uploadImages";
                var targetPath = cordova.file.dataDirectory + sourceFileName;
                var filename = targetPath.split("/").pop();

                var options = {
                    fileKey: "novaImagemProduto",
                    fileName: filename,
                    chunkedMode: false,
                    mimeType: "image/jpeg",
                    params: { 'directory': 'upload', 'fileName': filename } // directory represents remote directory,  fileName represents final remote file name
                };

                $cordovaFileTransfer.upload(url, sourcePath, options).then(function (result) {
                    vm.myPopup.close();
                    vm.imagemURL = JSON.parse(result.response).message;

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

        function activate() {
            //vm.solicitacao.titulo = '';
            //obterTipoCotacao();
            obterSegmentos();
            // obterSubSegmentos();
        }

        activate();
    }


})();