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

        //auxiliar
        //helper pra descobrir ciclos
        var ultima = null;

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
            passo1P1: null,
            passo1P2: null,
            passo2: null,
            passo3: null,
            passo4: null
        };

        $scope.verificar = function () {
            // if (!$scope.programas.p1 || !$scope.programas.p2) {
            //     alert("PREENCHA OS 2 PROGRAMAS");
            //     return;
            // }

            var linhasP1 = $scope.programas.p1.split('\n');
            var linhasP2 = $scope.programas.p2.split('\n');

            $scope.resultados.passo1P1 = monoliticoToInterativo(linhasP1, 1);
            $scope.resultados.passo1P2 = monoliticoToInterativo(linhasP2, $scope.resultados.passo1P1.length + 1);
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

            //se o programa comeca com um Teste ou com um Faca, afeta o algoritmo
            var comecaComSe = false;

            _.forEach(programa, function (line, index) {
                line = line.trim(); //remove whitespace

                var linhaSeparada = line.split(' ');  //quebra nos espacos

                if (index == 0) {
                    comecaComSe = (linhaSeparada[0] == (SE));
                }

                if (linhaSeparada[0] == (SE) && (!comecaComSe || index == 0)) {
                    var result = analisaTeste(programa, linhaSeparada, operacoes);
                    retorno.push(result);
                }

                if (linhaSeparada[0] == (FACA) && (comecaComSe || index == 0)) {
                    var result = analisaFaca(programa, linhaSeparada, operacoes, index == 0);
                    retorno.push(result);
                }
            });

            return retorno;
        }

        /**
         * Faz um faca sozinho
         * @param programa
         * @param linhaSeparada
         * @param operacoes
         * @param vindoDaPartida
         * @returns {*}
         */
        function analisaFaca(programa, linhaSeparada, operacoes, vindoDaPartida) {
            var faca = linhaSeparada[1];
            var vaPara = linhaSeparada[3];
            if (vaPara == "0") {
                return (montaPar("parada", 'E') + "," + montaPar("parada", 'E'));
            } else {
                var linha = programa[vaPara - 1];
                var facaDaLinhaSeparada = linha.split(' ');

                //se estiver vindo da partida apenas adiciona a operacao
                if (vindoDaPartida) {
                    return (montaPar(faca, operacoes[1]) + "," + montaPar(faca, operacoes[1]));
                } else {
                    if (facaDaLinhaSeparada[0] == (SE)) {
                        return analisaTeste(programa, facaDaLinhaSeparada, operacoes);
                    } else if (facaDaLinhaSeparada[0] == (FACA)) {
                        return (montaPar(facaDaLinhaSeparada[1], operacoes[vaPara]) + "," + montaPar(facaDaLinhaSeparada[1], operacoes[vaPara]));
                    }
                }
            }
        }


        /**
         * Analisa um teste
         * @param programa
         * @param linhaSeparada
         * @param operacoes
         * @returns {string}
         */
        function analisaTeste(programa, linhaSeparada, operacoes) {
            var vaPara = linhaSeparada[4];
            var senaoVaPara = linhaSeparada[7];

            var p1 = "";
            var p2 = "";

            if (vaPara == "0") {
                p1 = montaPar("parada", 'E');
            } else {
                ultima = null;
                p1 = analisaVaPara(programa, vaPara, operacoes[vaPara], true, operacoes);
            }

            if (senaoVaPara == "0") {
                p2 = montaPar("parada", 'E');
            } else {
                ultima = null;
                p2 = analisaVaPara(programa, senaoVaPara, operacoes[senaoVaPara], false, operacoes);
            }

            return p1 + "," + p2;
        }


        /**
         * Analisa um va_para dentro de um teste
         * @param programa
         * @param numLinha
         * @param numOperacao
         * @param teste
         * @param operacoes
         * @returns {*}
         */
        function analisaVaPara(programa, numLinha, numOperacao, teste, operacoes) {
            var line = programa[numLinha - 1];

            var linhaSeparada = line.split(' ');  //quebra nos espacos

            if (linhaSeparada[0] == FACA) {
                var faca = linhaSeparada[1];
                return montaPar(faca, numOperacao);
            } else if (linhaSeparada[0] == SE) {
                var vaPara = linhaSeparada[4];
                var senaoVaPara = linhaSeparada[7];

                //descobre se nao estamos em um ciclo
                if ((ultima == vaPara && teste) || (ultima == senaoVaPara && teste)) {
                    return montaPar("ciclo", "w");
                }

                ultima = numLinha;

                if (teste) {
                    return analisaVaPara(programa, vaPara, operacoes[vaPara], true, operacoes);
                } else {
                    return analisaVaPara(programa, senaoVaPara, operacoes[senaoVaPara], false, operacoes);
                }
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