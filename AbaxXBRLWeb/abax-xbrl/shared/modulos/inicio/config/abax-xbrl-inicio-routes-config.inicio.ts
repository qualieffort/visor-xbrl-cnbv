/// <reference path="../../../../../scripts/typings/angularjs/angular.d.ts" /> 
/// <reference path="../../../../../scripts/typings/angularjs/angular-route.d.ts" />
/// <reference path="../../../../../scripts/typings/angular-ui-router/angular-ui-router.ts" />

module abaxXBRL.routes {
    

    /**
    * Clase que especifica la configuración de las rutas para los componetes del modulo de inicio.
    **/
    export class AbaxXBRLInicioRoutesConfig {

        /** 
        * Constructor de la clase.
        * @param $stateProvider Proveedor de los cambios de estado de las vistas del sitio.
        **/
        constructor($stateProvider: ng.ui.IStateProvider) {
            

            $stateProvider.state("inicio.visorXBRL", { 
                //url:"/editorXBRL",
                //parent: 'inicio',
                views: {
                    'contenido': {
                        templateUrl: 'abax-xbrl/componentes/visor-xbrl/abax-xbrl-visor-xbrl-template.html',
                        controller: 'abaxVisorXBRLController'
                    }
                }
            });

            
            
        }
    }
    AbaxXBRLInicioRoutesConfig.$inject = ['$stateProvider'];
}