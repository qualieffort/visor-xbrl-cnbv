/// <reference path="../../../../../scripts/typings/angularjs/angular-route.d.ts" />
///<reference path="../../../../../scripts/typings/angular-ui-router/angular-ui-router.ts" />
/// <reference path="../../../../../scripts/typings/oclazyload/oclazyload.d.ts" />

module abaxXBRL.routes {
    

    /**
    * Clase que especifica la configuración de las rutas para los componetes de la administración.
    **/
    export class AbaxXBRLMainRoutesConfig {

        /** 
        * Constructor de la clase.
        * @param $stateProvider Proveedor de los cambios de estado de las vistas del sitio.
        * @param $urlRouterProvider Provedor de las rutas por defecto del sitio.
        **/
        constructor($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider) {
            
            /**Estado que envia la vista raíz a el home. **/
            $stateProvider.state("inicio", {
                //url: "/",
                views: {
                    'root': {
                        templateUrl: 'abax-xbrl/componentes/inicio/raiz/abax-xbrl-inicio-template.html',
                        controller: 'abaxXBRLInicioController'
                    }
                }
            });
        }
    }
    AbaxXBRLMainRoutesConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
}