(function () {
    'use strict';

    var app = angular.module('cotarApp');

    app.directive('numberOnly', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function (inputValue) {
                    inputValue = inputValue || "";

                    var transformedInput = inputValue.replace(/[^0-9]/g, '');

                    if (transformedInput != inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }

                    return transformedInput;
                });
            }
        };
    });

    app.directive('myCurrentTime', ['socket', '$interval', 'dateFilter', 'services',
        function (socket, $interval, dateFilter, services) {
            socket.connect();
            // return the directive link function. (compile function not needed)
            return function (scope, element, attrs) {
                var format = 'mm:ss a',  // date format
                    stopTime,
                    solicitacao,
                    contador;
                var tempoEmSegundos;

                function updateTime() {

                    // var novaData = new Date();
                    // novaData = moment(novaData).format('DD/MM/YYYY HH:mm:ss');

                    // var diferencaData = moment.utc(moment(novaData, "DD/MM/YYYY HH:mm:ss").diff(moment(solicitacao.dataCadastro, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    // var tempoEmSegundos = moment.duration(diferencaData).asSeconds();

                    // if (tempoEmSegundos <= 600) {
                    //     var intervaloData = moment.utc(moment(solicitacao.dataCadastro, "DD/MM/YYYY HH:mm:ss").diff(moment(novaData, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
                    //     contador = moment.utc(moment(intervaloData, "HH:mm:ss").diff(moment("23:50:00", "HH:mm:ss"))).format("mm:ss");
                    //     //mytimeout = setTimeout(criarTemporizador(solicitacao), 1000);

                    //     var progressBar = element.parent().find('div')[0];

                    //     if (progressBar != undefined) {
                    //         progressBar.style.width = (100 - ((tempoEmSegundos * 100) / 600)) + "%";
                    //     }

                    tempoEmSegundos = tempoEmSegundos || solicitacao.tempoEmSegundos;
                    var tempoCotacao = solicitacao.tempo * 3600;

                    if (tempoEmSegundos <= tempoCotacao) {
                        contador = (tempoCotacao - tempoEmSegundos);

                        var seconds = Math.floor(contador);
                        var hours = Math.floor(seconds / 3600);
                        seconds -= hours * 3600;
                        var minutes = Math.floor(seconds / 60);
                        seconds -= minutes * 60;

                        if (hours < 10) { hours = "0" + hours; }
                        if (minutes < 10) { minutes = "0" + minutes; }
                        if (seconds < 10) { seconds = "0" + seconds; }

                        contador = hours + ":" + minutes + ":" + seconds;

                        var progressBar = element.parent().find('div')[0];

                        if (progressBar != undefined) {
                            progressBar.style.width = (100 - ((tempoEmSegundos * 100) / tempoCotacao)) + "%";
                        }

                        tempoEmSegundos++;

                    } else if (solicitacao.ativo) {
                        solicitacao.ativo = false;

                        services.solicitacaoServices.editar(solicitacao).success(function (response) {
                            $interval.cancel(stopTime);
                        }).then(function () {
                            var device = {};
                            device = {
                                usuarioId: solicitacao.user._id,
                                titulo: 'Cotar Bem',
                                mensagem: 'Cotação encerrada'
                            }

                            services.notificacaoServices.notificarCliente(solicitacao).success(function (response) {
                            }).error(function (err, statusCode) {
                                load.hideLoading();
                                load.toggleLoadingWithMessage(err.message);
                            }).then(function () {
                                services.deviceServices.notificar(device).success(function (response) {
                                });
                            });

                            solicitacao.url = "app/cotacao/cliente/produto/" + solicitacao._id;

                            socket.emit('cotacao-encerrada', solicitacao);
                        });

                    } else {
                        $interval.cancel(stopTime);
                    }

                    element.text(dateFilter(contador, format));
                }

                // watch the expression, and update the UI on change.
                scope.$watch(attrs.myCurrentTime, function (value) {
                    ///format = value;
                    solicitacao = value;
                    updateTime();
                });

                stopTime = $interval(updateTime, 1000);

                // listen on DOM destroy (removal) event, and cancel the next UI update
                // to prevent updating time after the DOM element was removed.
                element.on('$destroy', function () {
                    $interval.cancel(stopTime);
                });
            }
        }]);

    app.directive('focusMe', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    element[0].focus();
                });
            }
        };
    });

    app.directive('obterNome', ['services',
        function (services) {
            // return the directive link function. (compile function not needed)
            return function (scope, element, attrs) {
                var usuarioId;

                function obterUsuario() {
                    services.usuarioServices.obterPorId(usuarioId).success(function (response) {
                        element.text(response.data.nome);
                    });
                }

                scope.$watch(attrs.obterNome, function (value) {
                    usuarioId = value;
                    obterUsuario();
                });
            }
        }]);

    app.directive('autolinker', ['$timeout',
        function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    $timeout(function () {
                        var eleHtml = element.html();

                        if (eleHtml === '') {
                            return false;
                        }

                        var text = Autolinker.link(eleHtml, {
                            className: 'autolinker',
                            newWindow: false
                        });

                        element.html(text);

                        var autolinks = element[0].getElementsByClassName('autolinker');

                        for (var i = 0; i < autolinks.length; i++) {
                            angular.element(autolinks[i]).bind('click', function (e) {
                                var href = e.target.href;
                                console.log('autolinkClick, href: ' + href);

                                if (href) {
                                    //window.open(href, '_system');
                                    window.open(href, '_blank');
                                }

                                e.preventDefault();
                                return false;
                            });
                        }
                    }, 0);
                }
            }
        }
    ]);

    app.directive('dinheiroMask', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                var formataValor = function (valor) {
                    valor = valor.replace(/[^0-9]+/g, '').replace(/^0+/, '');

                    if (valor.length == 1) {
                        valor = "0,0" + valor;
                        return valor;
                    }

                    if (valor.length == 2) {
                        valor = "0," + valor;
                        return valor;
                    }

                    if (valor.length > 2) {
                        var centavos = valor.substring(valor.length - 2);

                        valor = valor.substring(0, valor.length - 2) + "," + centavos;
                    }

                    if (valor.length > 6) {
                        var centenas = valor.substring(valor.length - 6);

                        valor = valor.substring(0, valor.length - 6) + "." + centenas;
                    }

                    return valor;
                };

                element.bind('keyup', function (key) {
                    if (key.keyCode != 37 && key.keyCode != 39 && key.keyCode != 8) {
                        var valor = modelCtrl.$viewValue;
                        modelCtrl.$setViewValue(formataValor(valor));
                        modelCtrl.$render();
                    }
                });
            },
        };
    });

    app.directive('googleplace', function () {
        return {
            require: 'ngModel',
            scope: {
                ngModel: '=',
                details: '=?'
            },
            link: function (scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
                        scope.details = scope.gPlace.getPlace();
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });

    app.directive('lanceUsuarioNome', ['autenticacao',
        function (autenticacao) {
            return {
                link: function (scope, element, attrs) {
                    var usuarioNome;
                    var usuarioLogado = autenticacao.getUser();

                    scope.$watch(attrs.lanceUsuarioNome, function (value) {
                        usuarioNome = value.usuarioId == usuarioLogado._id ? 'SEU LANCE' : value.usuarioNome;
                        element.text(usuarioNome);
                    });
                }
            }
        }]);

    app.directive("passwordVerify", function () {
        return {
            require: "ngModel",
            scope: {
                passwordVerify: '='
            },
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(function () {
                    var combined;

                    if (scope.passwordVerify || ctrl.$viewValue) {
                        combined = scope.passwordVerify + '_' + ctrl.$viewValue;
                    }
                    return combined;
                }, function (value) {
                    if (value) {
                        ctrl.$parsers.unshift(function (viewValue) {
                            var origin = scope.passwordVerify;
                            if (origin !== viewValue) {
                                ctrl.$setValidity("passwordVerify", false);
                                return undefined;
                            } else {
                                ctrl.$setValidity("passwordVerify", true);
                                return viewValue;
                            }
                        });
                    }
                });
            }
        };
    });

    app.directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    app.directive('badge', ['autenticacao',
        function (autenticacao) {
            return {
                link: function (scope, element, attrs) {
                    var usuarioLogado = autenticacao.getUser();

                    scope.$watch(attrs.badge, function (value) {
                        var usuario = value.visualizacao.user == usuarioLogado._id ? true : false;

                        if (usuario && value.visualizacao.ativo)
                            element.addClass('badge-chat');
                    });
                }
            }
        }]);
})()
