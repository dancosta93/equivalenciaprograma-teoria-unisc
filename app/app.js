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
            //P1 ex1
            'faça F vá_para 2\nse T então vá_para 3 senão vá_para 5\nfaça G vá_para 4\nse T então vá_para 1 senão vá_para 0\nfaça F vá_para 6\nse T então vá_para 7 senão vá_para 2\nfaça G vá_para 8\nse T então vá_para 6 senão vá_para 0',

            //P1 ex2
            'se T entao va_para 2 senao va_para 3\nfaça G va_para 1\nfaça F va_para 4\nse T entao va_para 5 senao va_para 6\nfaça F va_para 4\nfaça G va_para 7\nse T entao va_para 8 senao va_para 9\nfaça F va_para 10\nse T entao va_para 0 senao va_para 7\nse T entao va_para 0 senao va_para 11\nfaça G va_para 11',

            //P2 ex1
            'se T então vá_para 2 senão vá_para 3\nfaça G vá_para 9\nfaça F vá_para 10\nse T então vá_para 2 senão vá_para 3\nfaça G vá_para 11\nse T então vá_para 3 senão vá_para 5\nfaça F vá_para 2\nfaça F vá_para 3\nse T então vá_para 7 senão vá_para 8\nse T então vá_para 0 senão vá_para 8\nse T então vá_para 8 senão vá_para 8',

            //P2 ex2
            'se T então vá_para 2 senão vá_para 3\nfaça G vá_para 1\nfaça F vá_para 4\nse T então vá_para 3 senão vá_para 5\nfaça G vá_para 6\nse T então vá_para 7 senão vá_para 8\nfaça F vá_para 9\nfaça F vá_para 8\nse T então vá_para 0 senão vá_para 6'
        ];


        $scope.resultados = {
            passo1P1: null,
            passo1P2: null,
            passo2P1: null,
            passo2P2: null,
            passo3P1: null,
            passo3P2: null,
            passo4: null
        };

        $scope.verificar = function () {
            // if (!$scope.programas.p1 || !$scope.programas.p2) {
            //     alert("PREENCHA OS 2 PROGRAMAS");
            //     return;
            // }

            var linhasP1 = $scope.programas.p1.split('\n');
            var linhasP2 = $scope.programas.p2.split('\n');

            $scope.resultados.passo1P1 = realizaPasso1(linhasP1, 1);
            $scope.resultados.passo1P2 = realizaPasso1(linhasP2, $scope.resultados.passo1P1.length + 1);

            //TODO analisa se tem ciclo

            $scope.resultados.passo2P1 = realizaPasso2($scope.resultados.passo1P1, 0);
            console.log($scope.resultados.passo2P1);
            $scope.resultados.passo2P2 = realizaPasso2($scope.resultados.passo1P2, $scope.resultados.passo1P1.length);
            console.log($scope.resultados.passo2P2);
        };

        //passo 1
        function realizaPasso1(programa, numOperacao) {

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
                if ((ultima == vaPara && teste) || (ultima == senaoVaPara && !teste)) {
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
        function realizaPasso2(rotulos, margem) {
            var rotulosCopy = angular.copy(rotulos);

            var indexDaParada = rotulosCopy.length;
            
            var retorno = ["E"];

            //se contem ciclo devemos adicionar o w: (ciclo,w) no final
            var contemCiclo = false;

            //identifica a parada
            for(var x = rotulosCopy.length - 1; x > 0; x--){
                var rotulo = rotulosCopy[x];
                if(rotulo.indexOf("(parada,E)") != -1){
                    indexDaParada = x;
                    break;
                }
            }

            retorno.push(retorno[retorno.length - 1] + "," + (indexDaParada + 1 + margem));

            for(var x = indexDaParada - 1; x >= 0; x--){
                var indexAdicionar = []; //controla os indices que iremos adicionar

                if(retorno[retorno.length - 1].indexOf((x+1 +margem)) == -1){
                    indexAdicionar.push(x + 1 +margem);
                }

                var rotulo = rotulosCopy[x];
                //Olha nos rotulos anteriores se nao existe um rotulo exatamente igual
                for(var y = x -1; y >= 0; y--){
                    //confere se o rotulo eh exatamente igual
                    //se for vai ser inserido junto
                    if(rotulo == rotulosCopy[y]){
                        if(retorno[retorno.length - 1].indexOf((y+1 +margem)) == -1){
                            indexAdicionar.push(y + 1 + margem);
                        }
                    }
                }

                if(indexAdicionar.length > 0){
                    retorno.push(retorno[retorno.length - 1] + "," + indexAdicionar.join(','));
                }
            }

            return retorno;
        }


        //passo 3
        function realizaPasso3Simplificacao(programa) {

        }

        //passo 4
        function realizaPasso4Equivalencia(programa1, programa2) {

        }


    });