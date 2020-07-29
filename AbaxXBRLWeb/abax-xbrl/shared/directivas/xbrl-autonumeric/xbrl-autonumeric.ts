///<reference path="../../../../scripts/typings/autonumeric/autonumeric.d.ts" />
module abaxXBRL.directives.visor {

    /**
         * Implementación de una directiva para el plugin autoNumeric de JQuery
         *
         * @author José Antonio Huizar Moreno
         * @version 1.0
         */
    export class XbrlAutoNumeric {

        /**
         * Crea la definción de la directiva.
         *
         * @return la definición de la directiva.
         */
        public static XbrlAutoNumericDirective(): ng.IDirective {
            var options = {};
            return {
                require: '?ngModel',
                restrict: 'A',
                scope: {
                    opcionesAutoNumeric: '=',
                    expresion: '@',
                    modelo: '='
                },
                link: function ($scope: IAutoNumericDirectiveScope, element: ng.IAugmentedJQuery, attrs: IAutoNumericDirectiveAttributes, ngModel: ng.INgModelController) {

                    $scope.$on("$destroy", function () {
                        element.autoNumeric('destroy');
                        element.remove();
                    });

                    element.autoNumeric('init', $scope.opcionesAutoNumeric);

                    if (!ngModel) {

                        $scope.$watch(attrs.expresion, function () {
                            var valor = $scope.$eval(attrs.expresion);
                            if ($.isNumeric(valor)) {
                                element.autoNumeric('init', $scope.opcionesAutoNumeric);
                                element.autoNumeric('set', valor);
                            }
                        });

                    } else {

                        ngModel.$formatters.push(function (value) {
                            if (!value) {
                                return value;
                            }
                            element.autoNumeric('init', $scope.opcionesAutoNumeric);
                            element.autoNumeric('set', value);
                            return element.val();
                        });

                        ngModel.$parsers.push(function (value) {
                            if (!value) {
                                return value;
                            }
                            return element.autoNumeric('get');
                        });
                    }
                }
            }
        }
    }
}