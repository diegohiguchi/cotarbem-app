(function () {
    'use strict';

    var serviceId = 'services';

    function services(loginServices, tipoUsuarioServices, categoriaServices, cotacaoServices, usuarioServices, solicitacaoServices,
                      produtoServices, deviceTokenServices, salaServices, localizacaoServices, denunciaServices, avaliacaoServices,
                      faleConoscoServices, notificacaoServices, dashboardServices, segmentoServices, subSegmentoServices) {
        var service = {
            loginServices: loginServices,
            tipoUsuarioServices: tipoUsuarioServices,
            categoriaServices: categoriaServices,
            cotacaoServices: cotacaoServices,
            usuarioServices: usuarioServices,
            solicitacaoServices: solicitacaoServices,
            produtoServices: produtoServices,
            deviceTokenServices: deviceTokenServices,
            salaServices: salaServices,
            localizacaoServices: localizacaoServices,
            denunciaServices: denunciaServices,
            avaliacaoServices: avaliacaoServices,
            faleConoscoServices: faleConoscoServices,
            notificacaoServices: notificacaoServices,
            dashboardServices: dashboardServices,
            segmentoServices: segmentoServices,
            subSegmentoServices: subSegmentoServices,
            /*salaServices: salaServices,
            salaUsuarioServices: salaUsuarioServices*/
    };
        return service;
    }

    angular.module('cotarApp').factory(serviceId, [
        'loginServices', 'tipoUsuarioServices', 'categoriaServices', 'cotacaoServices', 'usuarioServices', 'solicitacaoServices',
        'produtoServices', 'deviceTokenServices', 'salaServices', 'localizacaoServices', 'denunciaServices', 'avaliacaoServices',
        'faleConoscoServices', 'notificacaoServices', 'dashboardServices', 'segmentoServices', 'subSegmentoServices',
        services]);
})();