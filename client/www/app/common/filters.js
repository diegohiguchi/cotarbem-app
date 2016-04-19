(function () {
    'use strict';

    var app = angular.module('cotarApp');

    app.filter('statusDescricao', function () {
        return function (data) {
            return data !== true ? 'Encerrado' : 'Em andamento';
        };
    });

    app.filter('nl2br', ['$filter',
        function ($filter) {
            return function (data) {
                if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
            };
        }
    ]);

    app.filter('checked', function () {
        return function (data) {
            return (data != undefined && data.length) > 0 ? 'checked' : '';
        };
    });

    app.filter('escondeBotaoMenu', function () {
        return function (data) {
            return (data != undefined && data) === 'Administrador' ? 'false' : 'true';
        };
    });

    app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

    app.filter('posicao', function () {
        return function (data) {
            if (data == 0)
                return 'primeiro';
            else if (data == 1)
                return 'segundo';
            else if (data == 2)
                return 'terceiro';
            else
                return 'quarto';
        };
    });

    app.filter('isEmpty', [function () {
        return function (object) {
            return angular.equals({}, object);
        }
    }]);
    
    app.filter('split', function() {
        return function(input, splitChar, splitIndex) {
            return input.split(splitChar)[splitIndex];
        }
    });

    app.filter('tipoNotificacao', function () {
        return function (data) {
            if(data == 'Cotação aberta')
                return 'fa left fa-clock-o';
            else if(data == 'Cotação encerrada')
                return 'fa left fa-check';
            else if(data == 'Chat')
                return 'fa left fa-comment';
            else if(data == 'Leilão')
                return 'fa left fa-gavel';
        };
    });

})();
