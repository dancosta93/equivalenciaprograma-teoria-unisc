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

        var FACA = "faça";
        var SE = "se";

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
            if (!$scope.programas.p1 || !$scope.programas.p2) {
                alert("PREENCHA OS 2 PROGRAMAS");
                return;
            }

            var linhasP1 = $scope.programas.p1.split('\n');
            var linhasP2 = $scope.programas.p2.split('\n');

            var passo1P1 = monoliticoToInterativo(linhasP1, 1);
            console.log(passo1P1);
            var passo1P2 = monoliticoToInterativo(linhasP2, 10);

            $scope.resultados.passo1 = passo1P1;

        };

        //passo 1
        function monoliticoToInterativo(programa, numOperacao) {

            var retorno = [];
            var operacoes = [];

            //Vamos marcar cada operacao com seu respectivo numero
            _.forEach(programa, function (line, index) {
                line = line.trim(); //remove whitespace

                var linhaSeparada = line.split(' ');  //quebra nos espacos

                //numera todos FACA
                if (linhaSeparada[0] == FACA) {
                    operacoes[index + 1] = ++numOperacao;
                }
            });

            console.log(operacoes);

            _.forEach(programa, function (line, index) {
                line = line.trim(); //remove whitespace

                var linhaSeparada = line.split(' ');  //quebra nos espacos

                if (linhaSeparada[0] == (SE)) {
                    var result = getTeste(programa, linhaSeparada, operacoes);
                    retorno.push(result);
                } else if (linhaSeparada[0] == (FACA)) {
                    var result = getFaca2(programa, linhaSeparada, operacoes);
                    retorno.push(result);
                }
            });

            return retorno;
        }

        function getFaca2(programa, linhaSeparada, operacoes) {
            var vaPara = linhaSeparada[3];
            if (vaPara == "0") {
                return (montaPar("parada", 'E') + "," + montaPar("parada", 'E'));
            } else {
                var linha = programa[vaPara - 1];
                var facaDaLinha = linha.split(' ')[1];

                var facaDaLinhaSeparada = linha.split(' ');

                if (facaDaLinhaSeparada[0] == (SE)) {
                    return getTeste(programa, facaDaLinhaSeparada, operacoes);
                } else if (facaDaLinhaSeparada[0] == (FACA)) {
                    return (montaPar(facaDaLinha, operacoes[vaPara]) + "," + montaPar(facaDaLinha, operacoes[vaPara]));
                }
            }
        }


        function getTeste(programa, linhaSeparada, operacoes) {
            var vaPara = linhaSeparada[4];
            var senaoVaPara = linhaSeparada[7];

            var p1 = "";
            var p2 = "";

            if (vaPara == "0") {
                p1 = montaPar("parada", 'E');
            } else {
                p1 = getFaca(programa, vaPara, operacoes[vaPara]);
            }

            if (senaoVaPara == "0") {
                p2 = montaPar("parada", 'E');
            } else {
                p2 = getFaca(programa, senaoVaPara, operacoes[senaoVaPara]);
            }

            return p1 + "," + p2;
        }


        //auxiliar
        function getFaca(programa, numLinha, numOperacao) {
            var line = programa[numLinha - 1];

            var linhaSeparada = line.split(' ');  //quebra nos espacos

            if (linhaSeparada[0] == FACA) {
                var faca = linhaSeparada[1];
                return montaPar(faca, numOperacao);
            } else if (linhaSeparada[0] == SE) {
                var vaPara = linhaSeparada[4];
                var senaoVaPara = linhaSeparada[7];

            }

        }

        function montaPar(v1, v2) {
            return "(" + v1 + "," + v2 + ")";
        }


        //passo 2
        function ciclosInfinitos(programa, init) {

        }


        //passo 3
        function simplificacao(programa) {

        }

        //passo 4
        function equivalencia(programa1, programa2) {

        }


    });