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
            'faça F vá_para 2\nse T então vá_para 3 senão vá_para 1\nfaça G vá_para 4\nse T então vá_para 1 senão vá_para 0',

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
            if (!$scope.programas.p1 || !$scope.programas.p2) {
                alert("PREENCHA OS 2 PROGRAMAS");
                return;
            }

            //TODO analisa se tem ciclo
            $scope.contemCiclo = false;
            $scope.contemCicloPosSimplificacao = false;

            var linhasP1 = $scope.programas.p1.split('\n');
            var linhasP2 = $scope.programas.p2.split('\n');

            $scope.resultados.passo1P1 = realizaPasso1(linhasP1, 1);
            $scope.resultados.passo1P2 = realizaPasso1(linhasP2, $scope.resultados.passo1P1.length + 1);

            var passo2p1 = realizaPasso2e3($scope.resultados.passo1P1, 0);
            var passo2p2 = realizaPasso2e3($scope.resultados.passo1P2, $scope.resultados.passo1P1.length);

            $scope.resultados.passo2P1 = passo2p1.passo2;
            $scope.resultados.passo2P2 = passo2p2.passo2;

            $scope.novoArrayP1 = passo2p1.novoArray;
            $scope.novoArrayP2 = passo2p2.novoArray;

            $scope.naoPrecisaP1 = $scope.resultados.passo1P1.length == $scope.novoArrayP1.length;
            $scope.naoPrecisaP2 = $scope.resultados.passo1P2.length == $scope.novoArrayP2.length;

            $scope.equivalentes = false;
            $scope.resultados.passo4 = realizaPasso4Equivalencia($scope.novoArrayP1, $scope.novoArrayP2);
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
                    $scope.contemCiclo = true;
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

        function montaRotulo(v1, v2) {
            return "{" + v1 + "," + v2 + "}";
        }

        /**
         * Passo 2 e 3
         * @param rotulos os rotulos do programa, que conseguimos no passo 1
         * @param margem caso se trate do Programa 2, temos uma margem para a numeracao do Programa 2 (seria o numero de rotulos do P1)
         * ex: se o P1 tem 5 rotulos, o P2 comeca no 6
         * Retorna o programa simplificado (se ocorrer simplificacao) e retorna o Passo 2 para visualizacao
         * @returns {{passo2: string[], novoArray: *}}
         */
        function realizaPasso2e3(rotulos, margem) {
            var rotulosCopy = angular.copy(rotulos);

            var indexDaParada = rotulosCopy.length;

            var retorno = ["E"];

            //se contem ciclo devemos adicionar o w: (ciclo,w) no final
            var contemCiclo = false;

            //identifica a parada
            for (var x = rotulosCopy.length - 1; x > 0; x--) {
                var rotulo = rotulosCopy[x];
                if (rotulo.indexOf("(parada,E)") != -1) {
                    indexDaParada = x;
                    break;
                }
            }

            retorno.push(retorno[retorno.length - 1] + "," + (indexDaParada + 1 + margem));

            for (var x = indexDaParada - 1; x >= 0; x--) {
                var indexAdicionar = []; //controla os indices que iremos adicionar

                if (retorno[retorno.length - 1].indexOf((x + 1 + margem)) == -1) {
                    indexAdicionar.push(x + 1 + margem);
                }

                var rotulo = rotulosCopy[x];
                //Olha nos rotulos anteriores se nao existe um rotulo exatamente igual
                for (var y = x - 1; y >= 0; y--) {
                    //confere se o rotulo eh exatamente igual
                    //se for vai ser inserido junto
                    if (rotulo == rotulosCopy[y]) {
                        if (retorno[retorno.length - 1].indexOf((y + 1 + margem)) == -1) {
                            indexAdicionar.push(y + 1 + margem);
                        }
                    }
                }

                if (indexAdicionar.length > 0) {
                    retorno.push(retorno[retorno.length - 1] + "," + indexAdicionar.join(','));
                }
            }

            var qtdExcluir = rotulosCopy.length - (indexDaParada + 1);
            var removidos = rotulosCopy.splice(indexDaParada + 1, qtdExcluir);

            var indicesRemovidos = []; //armazenar os indices que foram removidos

            _.forEach(removidos, function (x, index) {
                indicesRemovidos.push(index + 1 + rotulosCopy.length + margem);
            });

            //Busca por referencia aos excluidos para substituir por (ciclo,w)
            for (var x = rotulosCopy.length - 1; x > 0; x--) {
                //Para cada linha, busca por referencia para cada indice que foi removido
                _.forEach(indicesRemovidos, function (i) {
                    rotulosCopy[x] = procuraReferenciaSubstituiPorCiclo(rotulosCopy[x], i);
                });
                if (!$scope.contemCicloPosSimplificacao && rotulosCopy[x].indexOf("ciclo") != -1) {
                    $scope.contemCicloPosSimplificacao = true;
                }
            }

            var result = {
                passo2: retorno,
                novoArray: rotulosCopy
            };

            return result;
        }


        /**
         * Procura em um rotulo por uma referencia especifica, que deve ser substituida por um ciclo
         * @param rotulo
         * @param aProcurar
         */
        function procuraReferenciaSubstituiPorCiclo(rotulo, aProcurar) {

            //desmonta o rotulo para procurar individualmente
            var parts = rotulo.split("),(");
            var part1 = parts[0] + "),";
            var part2 = "(" + parts[1];

            if (part1.indexOf(aProcurar) != -1) {
                part1 = "(ciclo,w)";
            }

            if (part2.indexOf(aProcurar) != -1) {
                part2 = "(ciclo,w)";
            }

            //monta novamente
            return part1 + part2;
        }


        /**
         * Passo 4, realiza o processo de equivalencia entre o p1 e p2
         * @param p1
         * @param p2
         * @returns {Array}
         */
        function realizaPasso4Equivalencia(p1, p2) {

            //removemos todos rotulos duplicados antes de comecar a comparar
            var programa1 = removeRotulosDuplicados(p1);
            var programa2 = removeRotulosDuplicados(p2);

            console.log(programa1);
            console.log(programa2);

            var resultado = [];

            //checa os primeiros rotulos para montar o B0 e B1, se os primeiros ja nao forem equivalentes, ja paramos por aqui
            var result = checaEquivalenciaRotulos(programa1[0], programa2[0]);
            if(!result.equivalentes){
                $scope.equivalentes = false;
            }else{
                resultado.push("{" + montaPar(1, $scope.resultados.passo1P1.length + 1) + "}"); //B0
                resultado.push(montaRotulo(result.par1, result.par2)); //B1

                //equivalente ate que se prove o contrario
                $scope.equivalentes = true;
                for(var x = 1; x < programa1.length; x++){
                    if(programa1[x] && programa2[x]){
                        var result = checaEquivalenciaRotulos(programa1[x], programa2[x]);
                        if(result.equivalentes){
                            resultado.push(montaRotulo(result.par1, result.par2)); //BX
                        }else{
                            $scope.equivalentes = false;
                            resultado.push("≠");
                            break; //break the loop
                        }
                    }else{
                        $scope.equivalentes = false;
                        resultado.push("≠");
                        break; //break the loop
                    }
                }
            }

            if($scope.equivalentes){
                resultado.push("∅");
            }

            return resultado;
        }

        /**
         * Checa equivalencia entre 2 pares rotulos
         * @param rotulo1
         * @param rotulo2
         */
        function checaEquivalenciaRotulos(rotulo1, rotulo2) {
            //desmonta o par de rotulo para procurar individualmente
            var partsRotulo1 = rotulo1.split("),(");
            var rotulo1Valor1 = partsRotulo1[0].split(',')[1];
            var rotulo1Valor2 = partsRotulo1[1].split(',')[1].replace(")", "");

            var partsRotulo2 = rotulo2.split("),(");
            var rotulo2Valor1 = partsRotulo2[0].split(',')[1];
            var rotulo2Valor2 = partsRotulo2[1].split(',')[1].replace(")", "");

            var par1 = montaPar(rotulo1Valor1,rotulo2Valor1);
            var par2 = montaPar(rotulo1Valor2,rotulo2Valor2);

            var par1Equivalente = checaEquivalenciaValor(rotulo1Valor1, rotulo2Valor1);
            var par2Equivalente = checaEquivalenciaValor(rotulo1Valor2, rotulo2Valor2);

            return {
                par1: par1,
                par2: par2,
                equivalentes: par1Equivalente && par2Equivalente
            }
        }


        /**
         * remove os rotulos duplicados de um programa
         * Por ex: {(F,2),(G,5)} e {(F,2),(G,5)}
         * @param p
         * @returns {Array}
         */
        function removeRotulosDuplicados(p){
            var programa = angular.copy(p);
            var novosRotulos = [];

            _.forEach(programa, function(p){
                if(!_.includes(novosRotulos, p)){
                    novosRotulos.push(p);
                }
            });

            return novosRotulos;
        }

        /**
         * Compara equivalencia entre 2 valores
         * ciclo = ciclo
         * w = w
         * E = E
         * parada = parada
         * INT = INT
         * sao exemplos de valores equivalentes
         * @param v1
         * @param v2
         */
        function checaEquivalenciaValor(v1, v2) {
            //se sao exatamente iguais
            if (v1 == v2) {
                return true;
            }
            //se sao inteiros
            if (isInt(v1) && isInt(v2)) {
                return true;
            }
            return false;
        }

        //helper
        function isInt(x) {
            var y = parseInt(x, 10);
            return !isNaN(y) && x == y && x.toString() == y.toString();
        }



    });