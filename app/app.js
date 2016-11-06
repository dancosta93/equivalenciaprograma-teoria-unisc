/**
 * Created by Daniel Costa <danielcosta123@gmail.com> on 11/20/2015.
 */

'use strict';

angular.module('MyApp', ['ui.bootstrap'])
    .constant('URL', "http://127.0.0.1:8080/")
    .constant('_', window._); //lodash

angular.module('MyApp')
    .controller('AppController', function ($scope, $http, URL) {

        var vm = this;

        $scope.programas = {
            p1: null,
            p2: null
        };

        $scope.exemplos = [
            'faça F vá_para 2\nse T então vá_para 3 senão vá_para 5\nfaça G vá_para 4\nse T então vá_para 1 senão vá_para 0\nfaça F vá_para 6\nse T então vá_para 7 senão vá_para 2\nfaça G vá_para 8\nse T então vá_para 6 senão vá_para 0',
            'faça F vá_para 2\nse T então vá_para 3 senão vá_para 1\nfaça G vá_para 4\nse T então vá_para 1 senão vá_para 0',
            'se T então vá_para 2 senão vá_para 3\nfaça G vá_para 2\nfaça F vá_para 3\nse T então vá_para 2 senão vá_para 3\nse T então vá_para 6 senão vá_para 7\nfaça F vá_para 4\nfaça G vá_para 5\nse T então vá_para 6 senão vá_para 7\nse T então vá_para 10 senão vá_para 11\nfaça F vá_para 6\nse T então vá_para 10 senão vá_para 9\nse T então vá_para 0 senão vá_para 13\nfaça G vá_para 7\nse T então vá_para 13 senão vá_para 13',
            'se T então vá_para 2 senão vá_para 3\nfaça G vá_para 9\nfaça F vá_para 10\nse T então vá_para 2 senão vá_para 3\nfaça G vá_para 11\nse T então vá_para 3 senão vá_para 5\nfaça F vá_para 12\nfaça F vá_para 13\nse T então vá_para 7 senão vá_para 8\nse T então vá_para 0 senão vá_para 8\nse T então vá_para 8 senão vá_para 8'
        ];


        $scope.resultados = {
            passo1: null,
            passo2: null,
            passo3: null,
            passo4: null
        };

        $scope.verificar = function () {


        }


    });