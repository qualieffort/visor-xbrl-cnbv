///<reference path="../../../../../scripts/typings/angularjs/angular.d.ts" /> 
///<reference path="../../../../../scripts/typings/angularjs/angular-route.d.ts" />
///<reference path="../../../../../scripts/typings/angularjs/angular-resource.d.ts" />
///<reference path="../../../../../scripts/typings/impromptu/jquery-impromptu.d.ts" />
///<reference path="../../../../visorXbrl.ts" /> 
///<reference path="../../../../directivasAbax.ts" /> 
///<reference path="../../../../modeloAbax.ts" /> 
///<reference path="../../../../modeloPlantillaAbax.ts" /> 
///<reference path="../../../../jQuery/pluginsXbrl.ts" /> 

///<reference path="../../../../../scripts/typings/moment/moment.d.ts" />
module abaxXBRL.templates.extensions {

    /**
       * Implementación del controlador encargado de crear el comportamiento necesario para presentar el desglose de créditos en pantalla.
       *
       * @author José Antonio Huizar Moreno
       * @version 1.0
       */
    export class XbrlDesgloseCreditosController {

        /** El scope del controlador */
        private $scope: IXbrlDesgloseCreditosScope;

        /** El servicio angular parala comunicación con el backend de la aplicación */
        private abaxService: services.AbaxXBRLServices;

        /** El servicio para ejecutar tareas asíncronas de angular */
        private $timeout: ng.ITimeoutService;


        /** El nombre de la dimensión tipificada institución */
        public static get NOMBRE_DIMENSION_INSTITUCION(): string { return 'InstitucionDomain'; }

        /** El espacio de nombres de la dimensión tipificada institución */
        public static get ESPACIO_NOMRES_DIMENSION_INSTITUCION(): string { return 'http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05'; }

        /** Contiene la plantilla que deberá usarse para definir un nuevo valor de la dimensión tipificada institución */
        public static get TEMPLATE_VALOR_DIMENSION_INSTITUCION(): string { return '<ifrs_mx-cor_20141205:InstitucionDomain xmlns:ifrs_mx-cor_20141205="http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05">#valorDimensionInstitucion</ifrs_mx-cor_20141205:InstitucionDomain>'; }

        /** Contiene el nombre del placeholder para reemplazar en la plantilla de definición un nuevo valor de la dimensión tipificada institución */
        public static get PLACEHOLDER_VALOR_DIMENSION_INSTITUCION(): string { return '#valorDimensionInstitucion'; }

        /** Contiene el nombre completamente calificado de la dimensión explicita dimensión */
        public static get QNAME_DIMENSION_DENOMINACION(): string { return 'http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:DenominacionEje'; }

        /** Identificador de la dimensión de Denominación**/
        public static get ID_DIMENSION_DENOMINACION(): string { return 'ifrs_mx-cor_20141205_DenominacionEje'; }

        /** Contiene el nombre completamente calificado de la dimensión explicita intervalo de tiempo */
        public static get QNAME_DIMENSION_INTERVALO_TIEMPO(): string { return 'http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:IntervaloDeTiempoEje'; }

        /** Identificador de la dimensión explicita intervalo de tiempo */
        public static get ID_DIMENSION_INTERVALO_TIEMPO(): string { return 'ifrs_mx-cor_20141205_IntervaloDeTiempoEje'; }

        /** Contiene el nombre completamente calificado de la dimensión implícita institución */
        public static get QNAME_DIMENSION_INSTITUCION(): string { return 'http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:InstitucionEje'; }

        /** Identificador de la dimensión implícita institución */
        public static get ID_DIMENSION_INSTITUCION(): string { return 'ifrs_mx-cor_20141205_InstitucionEje'; }

        /** El nombre del elemento que contiene el prefijo de acuerdo a la librería X2JS */
        public static get X2JS_ELEMENTO_PREFIX(): string { return '__prefix'; }

        /** El prefijo del nombre del elemento que contiene el xmlns de acuerdo a la librería X2JS */
        public static get X2JS_PREFIJO_ELEMENTO_XMLNS(): string { return '_xmlns:'; }

        /** El nombre del elemento que contiene el texto contenido en un nodo xml de acuerdo a la librería X2JS */
        public static get X2JS_ELEMENTO_TEXT(): string { return '__text'; }

        /** El prefijo del nombre de la institución que se asignará a todos los nuevos elementos de la dimensión explícita creados por el editor */
        public static get PREFIJO_NOMBRE_INSTITUCION_DEFECTO(): string { return 'NUEVA INSTITUCIÓN'; }

        /** El espacio de nombres de la dimension tipificada de intervalos de tiempo. **/
        public static get ESPACIO_NOMBRES_DIMENSION_INTERVALO_DE_TIEMPO(): string { return "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05"; }

        /** El espacio de nombres de la dimension tipificada de intervalos de tiempo. **/
        public static get ESPACIO_NOMBRES_DIMENSION_DENOMINACION(): string { return "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05"; }

        /** Arreglo con los nombres de todos los elementos de la dimesión de intervalos de tiempo. **/
        public static get NOMBRE_ELEMENTOS_DIMENSION_INTERVALO_DE_TIEMPO(): Array<string> { return ["AnoActualMiembro", "Hasta1AnoMiembro", "Hasta2AnosMiembro", "Hasta3AnosMiembro", "Hasta4AnosMiembro", "Hasta5AnosOMasMiembro", "TotalIntervalosMiembro"]; }

        /** Arreglo con los nombres de todos los elementos de la dimesión denominación. **/
        public static get NOMBRE_ELEMENTOS_DIMENSION_DENOMINACION(): Array<string> { return ["MonedaNacionalMiembro", "MonedaExtranjeraMiembro", "TotalMonedasMiembro"]; }

        /** Nombre del elemento totales de la dimensión de intervalos de tiempo. **/
        public static get NOMBRE_ELEMENTO_TOTAL_DIMENSION_INTERVALO_DE_TIEMPO(): string { return "TotalIntervalosMiembro"; }

        /** Nombre del elemento totales de la dimensión de denominación. **/
        public static get NOMBRE_ELEMENTO_TOTAL_DIMENSION_DENOMINACION(): string { return "TotalMonedasMiembro"; }

        /**Identificador del item miembro **/
        private ID_ITEM_MIEMBRO_POR_QNAME: { [id: string]: string };

        /**Id del timeout para reevalura la plantilla **/
        private idTimeOutReEvaluaPlantilla: number;

        /** Settings de la tabla de excel. **/
        private tableSettings: plugins.XbrlTablaExcelSettings;
        
        /**
        * Funcion que se ejecuta una ves terminado el tiempo de espera del timeout.
        **/
        private onReEvaluaElementosPlantillaSucess(): void {
            
            var etiquetasConcepto = $('xbrl\\:etiqueta-concepto:not(.inicializado)');
            var $self = this;
            if (etiquetasConcepto.length > 0) {

                plugins.AngularJQueryBridge.getInstance().establecerMapaElementosPorIdHecho({});
                etiquetasConcepto.xbrlEtiquetaConcepto()
                etiquetasConcepto.addClass('inicializado');
            }
            /*var tablaExcelSinInicializar = $('table[xbrl\\:tabla-excel]:not(.inicializado)');
            if (tablaExcelSinInicializar.length > 0) {
                tablaExcelSinInicializar.xbrlTablaExcel('init', $self.tableSettings);
                tablaExcelSinInicializar.addClass('inicializado');
            }*/
            var etiquetasCampoCaptura = $('xbrl\\:campo-captura:not(.inicializado)');
            etiquetasCampoCaptura.xbrlCampoCaptura().promise().done(function () {
                //$('table[xbrl\\:tabla-excel]').xbrlTablaExcel('init', $self.tableSettings);
                etiquetasCampoCaptura.parent('td').parent('tr').show();
                etiquetasCampoCaptura.find('.div-default').removeClass('div-default');
                /*$('table[xbrl\\:tabla-excel]').find('td')
                    .removeClass('celdaSeleccionada')
                    .removeClass('rangoSeleccionado')
                    .removeClass('rangoSeleccionadoR')
                    .removeClass('rangoSeleccionadoL')
                    .removeClass('rangoSeleccionadoT')
                    .removeClass('rangoSeleccionadoB');*/
                //setTimeout(function () { plugins.XbrlPluginUtils.ocultarLoaderFormatos(); }, 1000);
            });
            etiquetasCampoCaptura.addClass('inicializado');
            shared.service.AbaxXBRLUtilsService.evaluaTablasDinamicas();
        }



        /**
        * Inicializa todos los detalles de Instituciones
        */
        private inicializarDetalleInstituciones(): void {
            var CONCEPTOS_DIMENSIONES_INSTITUCIONES = [
                "ifrs_mx-cor_20141205_ComercioExteriorBancarios",
                "ifrs_mx-cor_20141205_ConGarantiaBancarios",
                "ifrs_mx-cor_20141205_BancaComercial",
                "ifrs_mx-cor_20141205_OtrosBancarios",
                "ifrs_mx-cor_20141205_BursatilesListadasEnBolsaQuirografarios",
                "ifrs_mx-cor_20141205_BursatilesListadasEnBolsaConGarantia",
                "ifrs_mx-cor_20141205_ColocacionesPrivadasQuirografarios",
                "ifrs_mx-cor_20141205_ColocacionesPrivadasConGarantia",
                "ifrs_mx-cor_20141205_OtrosPasivosCirculantesYNoCirculantesConCosto",
                "ifrs_mx-cor_20141205_Proveedores",
                "ifrs_mx-cor_20141205_OtrosPasivosCirculantesYNoCirculantesSinCosto"
            ];
            var $self = this;

            var variablesPlantilla = new Array<{ llave: string; valor: string; }>();
            abaxXBRL.plugins.XbrlPluginUtils.cargarPlantillaYReemplazarVariables('ts/templates/taxonomias/ifrs_mx_20141205/extensions/itemCreditoInstitucion.html?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                variablesPlantilla,
                function (plantilla: JQuery) {

                    var valorPresentacion = $self.abaxService.getDocumentoInstancia().UnidadesPresentacionTipoDatoMonetario;
                    var numeroDecimales = $self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario;
                    var idHechoIndice = 0;

                    for (var idConcepto in CONCEPTOS_DIMENSIONES_INSTITUCIONES) {
                        var concepto = CONCEPTOS_DIMENSIONES_INSTITUCIONES[idConcepto];
                        var valorPlantillaDimensionInstitucion = "";
                        var numeroRegistrosDimensionInstitucion = 0;
                        for (var indiceValorDimensionInstitucion in $self.$scope.valoresDimensionInstitucionPorElementoPrimario[concepto]) {
                            var valorDimensionInstitucion = $self.$scope.valoresDimensionInstitucionPorElementoPrimario[concepto][indiceValorDimensionInstitucion];

                            var plantillaDimensionInstitucion = plantilla.clone()[0].outerHTML;
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("valorDimensionInstitucion", valorDimensionInstitucion);

                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaInstitucionExtranjeraSiNo", "idCampoCapturaInstitucionExtranjeraSiNo" + concepto + numeroRegistrosDimensionInstitucion);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaFechaDeFirmaContrato", "idCampoCapturaFechaDeFirmaContrato" + concepto + numeroRegistrosDimensionInstitucion);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaFechaDeVencimiento", "idCampoCapturaFechaDeVencimiento" + concepto + numeroRegistrosDimensionInstitucion);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaTasaDeInteresYOSobretasa", "idCampoCapturaTasaDeInteresYOSobretasa" + concepto + numeroRegistrosDimensionInstitucion);
                            

                            //Se asignan los valores

                            var HechoInstitucionExtranjeraSiNo = $self.$scope.obtenerHecho("ifrs_mx-cor_20141205_InstitucionExtranjeraSiNo", valorDimensionInstitucion, "TotalIntervalosMiembro", "TotalMonedasMiembro", true, null);
                            var HechoFechaDeFirmaContrato = $self.$scope.obtenerHecho("ifrs_mx-cor_20141205_FechaDeFirmaContrato", valorDimensionInstitucion, "TotalIntervalosMiembro", "TotalMonedasMiembro", true, null);
                            var HechoFechaDeVencimiento = $self.$scope.obtenerHecho("ifrs_mx-cor_20141205_FechaDeVencimiento", valorDimensionInstitucion, "TotalIntervalosMiembro", "TotalMonedasMiembro", true, null);
                            var HechoTasaDeInteresYOSobretasa = $self.$scope.obtenerHecho("ifrs_mx-cor_20141205_TasaDeInteresYOSobretasa", valorDimensionInstitucion, "TotalIntervalosMiembro", "TotalMonedasMiembro", true, null);

                            var HechoBancaComercialMNAnioActual = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "AnoActualMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");
                            var HechoBancaComercialMN1Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta1AnoMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");
                            var HechoBancaComercialMN2Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta2AnosMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");
                            var HechoBancaComercialMN3Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta3AnosMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");
                            var HechoBancaComercialMN4Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta4AnosMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");
                            var HechoBancaComercialMN5Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta5AnosOMasMiembro", "MonedaNacionalMiembro", false, "UnidadReporte");

                            var HechoBancaComercialMEAnioActual = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "AnoActualMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");
                            var HechoBancaComercialME1Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta1AnoMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");
                            var HechoBancaComercialME2Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta2AnosMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");
                            var HechoBancaComercialME3Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta3AnosMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");
                            var HechoBancaComercialME4Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta4AnosMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");
                            var HechoBancaComercialME5Anio = $self.$scope.obtenerHecho(concepto, valorDimensionInstitucion, "Hasta5AnosOMasMiembro", "MonedaExtranjeraMiembro", false, "UnidadReporte");


                            var valorHechoInstitucionExtranjeraSiNo = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoInstitucionExtranjeraSiNo);
                            var valorHechoFechaDeFirmaContrato = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoFechaDeFirmaContrato);
                            var valorHechoFechaDeVencimiento = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoFechaDeVencimiento);
                            var valorHechoTasaDeInteresYOSobretasa = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoTasaDeInteresYOSobretasa);

                            var valorHechoBancaComercialMNAnioActual = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMNAnioActual);
                            var valorHechoBancaComercialMN1Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMN1Anio);
                            var valorHechoBancaComercialMN2Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMN2Anio);
                            var valorHechoBancaComercialMN3Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMN3Anio);
                            var valorHechoBancaComercialMN4Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMN4Anio);
                            var valorHechoBancaComercialMN5Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMN5Anio);

                            var valorHechoBancaComercialMEAnioActual = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialMEAnioActual);
                            var valorHechoBancaComercialME1Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialME1Anio);
                            var valorHechoBancaComercialME2Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialME2Anio);
                            var valorHechoBancaComercialME3Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialME3Anio);
                            var valorHechoBancaComercialME4Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialME4Anio);
                            var valorHechoBancaComercialME5Anio = $self.$scope.obtenerValorHechoDesgloseCreditos1(HechoBancaComercialME5Anio);



                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_AnoActualMiembro", HechoBancaComercialMNAnioActual ? HechoBancaComercialMNAnioActual.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_Hasta1AnosMiembro", HechoBancaComercialMN1Anio ? HechoBancaComercialMN1Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_Hasta2AnosMiembro", HechoBancaComercialMN2Anio ? HechoBancaComercialMN2Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_Hasta3AnosMiembro", HechoBancaComercialMN3Anio ? HechoBancaComercialMN3Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_Hasta4AnosMiembro", HechoBancaComercialMN4Anio ? HechoBancaComercialMN4Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaNacionalMiembro_Hasta5AnosOMasMiembro", HechoBancaComercialMN5Anio ? HechoBancaComercialMN5Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_AnoActualMiembro", HechoBancaComercialMEAnioActual ? HechoBancaComercialMEAnioActual.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_Hasta1AnosMiembro", HechoBancaComercialME1Anio ? HechoBancaComercialME1Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_Hasta2AnosMiembro", HechoBancaComercialME2Anio ? HechoBancaComercialME2Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_Hasta3AnosMiembro", HechoBancaComercialME3Anio ? HechoBancaComercialME3Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_Hasta4AnosMiembro", HechoBancaComercialME4Anio ? HechoBancaComercialME4Anio.Id : "H" + idHechoIndice++);
                            plantillaDimensionInstitucion = plantillaDimensionInstitucion.replace("idCampoCapturaMonedaExtranjeraMiembro_Hasta5AnosOMasMiembro", HechoBancaComercialME5Anio ? HechoBancaComercialME5Anio.Id : "H" + idHechoIndice++);



                            var valorPlantillaDimensionQuery = $(plantillaDimensionInstitucion);
                            valorPlantillaDimensionQuery.find("#idCampoCapturaInstitucionExtranjeraSiNo" + concepto + numeroRegistrosDimensionInstitucion).append(valorHechoInstitucionExtranjeraSiNo);
                            valorPlantillaDimensionQuery.find("#idCampoCapturaFechaDeFirmaContrato" + concepto + numeroRegistrosDimensionInstitucion).append(valorHechoFechaDeFirmaContrato);
                            valorPlantillaDimensionQuery.find("#idCampoCapturaFechaDeVencimiento" + concepto + numeroRegistrosDimensionInstitucion).append(valorHechoFechaDeVencimiento);
                            valorPlantillaDimensionQuery.find("#idCampoCapturaTasaDeInteresYOSobretasa" + concepto + numeroRegistrosDimensionInstitucion).append(valorHechoTasaDeInteresYOSobretasa);

                            if (HechoBancaComercialMNAnioActual)
                                valorPlantillaDimensionQuery.find("#"+HechoBancaComercialMNAnioActual.Id).append(valorHechoBancaComercialMNAnioActual);
                            if (HechoBancaComercialMN1Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMN1Anio.Id).append(valorHechoBancaComercialMN1Anio);
                            if (HechoBancaComercialMN2Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMN2Anio.Id).append(valorHechoBancaComercialMN2Anio);
                            if (HechoBancaComercialMN3Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMN3Anio.Id).append(valorHechoBancaComercialMN3Anio);
                            if (HechoBancaComercialMN4Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMN4Anio.Id).append(valorHechoBancaComercialMN4Anio);
                            if (HechoBancaComercialMN5Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMN5Anio.Id).append(valorHechoBancaComercialMN5Anio);
                            if (HechoBancaComercialMEAnioActual)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialMEAnioActual.Id).append(valorHechoBancaComercialMEAnioActual);
                            if (HechoBancaComercialME1Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialME1Anio.Id).append(valorHechoBancaComercialME1Anio);
                            if (HechoBancaComercialME2Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialME2Anio.Id).append(valorHechoBancaComercialME2Anio);
                            if (HechoBancaComercialME3Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialME3Anio.Id).append(valorHechoBancaComercialME3Anio);
                            if (HechoBancaComercialME4Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialME4Anio.Id).append(valorHechoBancaComercialME4Anio);
                            if (HechoBancaComercialME5Anio)
                                valorPlantillaDimensionQuery.find("#" +HechoBancaComercialME5Anio.Id).append(valorHechoBancaComercialME5Anio);


                            valorPlantillaDimensionInstitucion += valorPlantillaDimensionQuery[0].outerHTML;
                            numeroRegistrosDimensionInstitucion++;

                        }

                        $("#" + concepto).replaceWith(valorPlantillaDimensionInstitucion);
                    }
                    
                    var conceptoTipoDato = $self.abaxService.getDocumentoInstancia().obtenerConceptoPorId("ifrs_mx-cor_20141205_ComercioExteriorBancarios");
                    var tipoDatoNumerico = <abaxXBRL.model.TipoDatoNumerico>(abaxXBRL.model.TiposDatoXbrl.getInstance().get()[conceptoTipoDato.TipoDatoXbrl]);
                    var opcionesAutonumeric = tipoDatoNumerico.OpcionesAutonumeric;

                    $(".spanValorNumericItem").each(function (index) {
                        var valorHechoMonetario = $(this).text();
                        if (valorHechoMonetario && valorHechoMonetario.length > 0) {
                            valorHechoMonetario = math.eval('bignumber("' + valorHechoMonetario + '")').dividedBy(valorPresentacion).toDP(numeroDecimales);
                            $(this).text(valorHechoMonetario);
                        }
                    });


                    if ($self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario > 0) {
                        var opcionesAutonumericPersonalizado: any = {};
                        opcionesAutonumericPersonalizado.mDec = numeroDecimales.toString();
                        opcionesAutonumericPersonalizado.vMin = opcionesAutonumeric.vMin;
                        opcionesAutonumericPersonalizado.vMax = opcionesAutonumeric.vMax;
                        opcionesAutonumericPersonalizado.aSign = opcionesAutonumeric.aSign;
                        opcionesAutonumericPersonalizado.nBracket = opcionesAutonumeric.nBracket;
                        opcionesAutonumericPersonalizado.pSign = opcionesAutonumeric.pSign;

                        $(".spanValorNumericItem").autoNumeric('init', opcionesAutonumericPersonalizado);
                    } else {

                        $(".spanValorNumericItem").autoNumeric('init', opcionesAutonumeric);
                    }

                    
                    
                    


                }, function (textStatus: any, errorThrown: any) {
                    console.log('ocurrió un error al cargar la plantilla de una etiqueta de concepto');
                });


        }
        /** Reevalua los elementos de la plantilla **/
        private reEvaluaElementosPlantilla(): void {
            var $self = this;
            setTimeout(function () {
                if ($self.idTimeOutReEvaluaPlantilla) {
                    clearTimeout($self.idTimeOutReEvaluaPlantilla);
                }
                var trigger = function () { $self.onReEvaluaElementosPlantillaSucess(); };
                $self.idTimeOutReEvaluaPlantilla = setTimeout(trigger, 10);
            },5);
        }

        /** 
        * Llena los indices para el contexto y dimensión indicados
        * @param idConcepto Identificador de concepto que será mapeado a los indices.
        * @param idContexto Identificador del contexto que será mapeado a los indices.
        * @param valorDimensionInstitucion Nombre del nuevo miembro del eje (dimensión) Instituciones.
        * @param qNameMiembroIntervalo el nombre completamente calificado del miembro de la dimensión intervalo de tiempo.
        * @param qNameMiembroDenominacion el nombre completamente calificado del miembro de la dimensión denominacion.
        */
        private agregaIndicesDimensionInstitucion(idConcepto: string, contexto: abaxXBRL.model.Contexto, valorDimensionInstitucion: string, qNameMiembroIntervalo: string, qNameMiembroDenominacion: string, tipoPeriodo: number): void {

            var documentoInstancia: model.DocumentoInstanciaXbrl = this.abaxService.getDocumentoInstancia();

            if (!this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion]) {
                this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion] = {};
            }
            if (!this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo]) {
                this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo] = {};
            }
            if (!this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo][qNameMiembroDenominacion]) {
                this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo][qNameMiembroDenominacion] = {};
                //console.log("agregaIndicesDimensionInstitucion:[" + valorDimensionInstitucion + "][" + qNameMiembroIntervalo + "][" + qNameMiembroDenominacion + "] = " + contexto.Id);
            }
            if (!this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo][qNameMiembroDenominacion][tipoPeriodo]) {
                this.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervalo][qNameMiembroDenominacion][tipoPeriodo] = contexto.Id;
                //console.log("agregaIndicesDimensionInstitucion:[" + valorDimensionInstitucion + "][" + qNameMiembroIntervalo + "][" + qNameMiembroDenominacion + "] = " + contexto.Id);
            }

            if (!this.$scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion]) {
                this.$scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion] = new Array<string>();
            }
            if ($.inArray(contexto.Id, this.$scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion]) == -1) {
                this.$scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion].push(contexto.Id);
            }
            if ($.inArray(valorDimensionInstitucion, this.$scope.valoresDimensionInstitucion) == -1) {
                this.$scope.valoresDimensionInstitucion.push(valorDimensionInstitucion);
            }
            if (idConcepto && idConcepto != null) {

                if (idConcepto == 'ifrs_mx-cor_20141205_InstitucionExtranjeraSiNo' || idConcepto == 'ifrs_mx-cor_20141205_FechaDeFirmaContrato' || idConcepto == 'ifrs_mx-cor_20141205_FechaDeVencimiento' || idConcepto == 'ifrs_mx-cor_20141205_TasaDeInteresYOSobretasa') {
                    this.$scope.contextoTotalesPorDimensionInstitucion[valorDimensionInstitucion] = contexto.Id;
                } else {
                    if (!this.$scope.valoresDimensionInstitucionPorElementoPrimario[idConcepto]) {
                        this.$scope.valoresDimensionInstitucionPorElementoPrimario[idConcepto] = new Array<string>();
                        this.$scope.valoresTemporalDimensionInstitucionPorElementoPrimario[idConcepto] = new Array<string>();
                    }
                    if ($.inArray(valorDimensionInstitucion, this.$scope.valoresDimensionInstitucionPorElementoPrimario[idConcepto]) == -1) {
                        this.$scope.valoresDimensionInstitucionPorElementoPrimario[idConcepto].push(valorDimensionInstitucion);
                        this.$scope.valoresTemporalDimensionInstitucionPorElementoPrimario[idConcepto].push(valorDimensionInstitucion);
                    }
                }
            }
        }

        /**
         * Inicializa el controlador.
         */
        private init(): void {
            var self = this;


            self.ID_ITEM_MIEMBRO_POR_QNAME = {
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:AnoActualMiembro": "ifrs_mx-cor_20141205_AnoActualMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:Hasta1AnoMiembro": "ifrs_mx-cor_20141205_Hasta1AnoMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:Hasta2AnosMiembro": "ifrs_mx-cor_20141205_Hasta2AnosMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:Hasta3AnosMiembro": "ifrs_mx-cor_20141205_Hasta3AnosMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:Hasta4AnosMiembro": "ifrs_mx-cor_20141205_Hasta4AnosMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:Hasta5AnosOMasMiembro": "ifrs_mx-cor_20141205_Hasta5AnosOMasMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:TotalIntervalosMiembro": "ifrs_mx-cor_20141205_TotalIntervalosMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:MonedaNacionalMiembro": "ifrs_mx-cor_20141205_MonedaNacionalMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:MonedaExtranjeraMiembro": "ifrs_mx-cor_20141205_MonedaExtranjeraMiembro",
                "http://bmv.com.mx/ifrs_mx-cor_20141205/full_ifrs_mx-cor_2014-12-05:TotalMonedasMiembro": "ifrs_mx-cor_20141205_TotalMonedasMiembro"
            };

            this.$scope.ultimoCampo = true;

            this.$scope.actualizarUltimoCampo = function () {
                if (!self.$scope.ultimoCampo) {
                    self.$scope.ultimoCampo = true;
                }
                return self.$scope.ultimoCampo;
            }

            var documentoInstancia = self.abaxService.getDocumentoInstancia();
            var definicionPlantilla = self.abaxService.getDefinicionPlantilla();

            var fechaInicioPeriodo = definicionPlantilla.obtenerVariablePorId('fecha_2015_01_01');
            var fechaFinTrimestre = definicionPlantilla.obtenerVariablePorId('fecha_2015_09_30');
            var emisora = definicionPlantilla.obtenerVariablePorId('nombreEntidad');
            var esquemaEmisora = definicionPlantilla.obtenerVariablePorId('esquemaEntidad');

            this.$scope.obtenerIdUnidadMoneda = function (): string {

                var hechoTasaInteresOSobretasa = new abaxXBRL.model.Hecho();
                var espacionNombresUnidades = definicionPlantilla.obtenerVariablePorId('medida_http___www_xbrl_org_2003_iso4217');
                var nombreUnidadMoneda = definicionPlantilla.obtenerVariablePorId('medida_MXN');
                var unidadMoneda = self.abaxService.ObtenerUnidadPorelementos(model.Unidad.MEDIDA, espacionNombresUnidades, nombreUnidadMoneda);
                return unidadMoneda.Id;
            }

            this.$scope.idUnidadMoneda = this.$scope.obtenerIdUnidadMoneda();

            this.$scope.obtenerIdUnidadPure = function (): string {

                var hechoTasaInteresOSobretasa = new abaxXBRL.model.Hecho();
                var espacionNombresUnidades = definicionPlantilla.obtenerVariablePorId('medida_http___www_xbrl_org_2003_instance');
                var nombreUnidadPure = 'pure';
                var unidadMoneda = self.abaxService.ObtenerUnidadPorelementos(model.Unidad.MEDIDA, espacionNombresUnidades, nombreUnidadPure);
                return unidadMoneda.Id;
            }

            this.$scope.idUnidadPure = this.$scope.obtenerIdUnidadPure();

            this.$scope.valorDefaultFecha = moment().format(model.ConstantesComunes.FORMATO_FECHA);

            self.$scope.contextosPorValorDimensionInstitucion = {};
            self.$scope.valoresDimensionInstitucionPorElementoPrimario = {};
            self.$scope.valoresTemporalDimensionInstitucionPorElementoPrimario = {};
            self.$scope.contextosPorLlaveDimension = {};
            self.$scope.valoresDimensionInstitucion = new Array<string>();
            self.$scope.contextoTotalesPorDimensionInstitucion = {};

            var contextosInstante = documentoInstancia.ContextosPorFecha[fechaFinTrimestre];
            var contextosDuracion = documentoInstancia.ContextosPorFecha[fechaInicioPeriodo + '_' + fechaFinTrimestre];
            var idsContextosRevisar = new Array();
            if (contextosInstante && contextosInstante != null && contextosInstante.length && contextosInstante.length > 0) {
                idsContextosRevisar = idsContextosRevisar.concat(contextosInstante);
            }
            if (contextosDuracion && contextosDuracion != null && contextosDuracion.length && contextosDuracion.length > 0) {
                idsContextosRevisar = idsContextosRevisar.concat(contextosDuracion);
            }

            var valoresDimensionComparar = new Array<abaxXBRL.model.DimensionInfo>();
            valoresDimensionComparar.push(new abaxXBRL.model.DimensionInfo().deserialize({
                Explicita: true,
                QNameDimension: XbrlDesgloseCreditosController.QNAME_DIMENSION_DENOMINACION,
                IdDimension: XbrlDesgloseCreditosController.ID_DIMENSION_DENOMINACION
            }));
            valoresDimensionComparar.push(new abaxXBRL.model.DimensionInfo().deserialize({
                Explicita: true,
                QNameDimension: XbrlDesgloseCreditosController.QNAME_DIMENSION_INTERVALO_TIEMPO,
                IdDimension: XbrlDesgloseCreditosController.ID_DIMENSION_INTERVALO_TIEMPO
            }));

            valoresDimensionComparar.push(new abaxXBRL.model.DimensionInfo().deserialize({
                Explicita: false,
                QNameDimension: XbrlDesgloseCreditosController.QNAME_DIMENSION_INSTITUCION,
                IdDimension: XbrlDesgloseCreditosController.ID_DIMENSION_INSTITUCION
            }));

            for (var i = 0; i < idsContextosRevisar.length; i++) {
                var contexto = documentoInstancia.ContextosPorId[idsContextosRevisar[i]];
                if (contexto && contexto != null) {
                    if (contexto.Entidad.Id === emisora && contexto.Entidad.EsquemaId === esquemaEmisora && contexto.ContieneInformacionDimensional && contexto.ValoresDimension && contexto.ValoresDimension.length && contexto.ValoresDimension.length == valoresDimensionComparar.length) {
                        var copiaComparar = valoresDimensionComparar.slice();
                        var valorDimensionInstitucion: string = null;
                        var qNameMiembroIntervalo: string = null;
                        var qNameMiembroDenominacion: string = null;
                        var equivalente = true;
                        for (var j = 0; j < contexto.ValoresDimension.length; j++) {
                            var equivalenteEncontrado: boolean = false;
                            for (var k = 0; k < copiaComparar.length; k++) {
                                if (contexto.ValoresDimension[j].EsInfoMismaDimension(copiaComparar[k])) {
                                    equivalenteEncontrado = true;
                                    if (!contexto.ValoresDimension[j].Explicita) {
                                        var elementoMiembroTipificado = abaxXBRL.utils.XmlUtils.CrearJsonAPartirDeXml(contexto.ValoresDimension[j].ElementoMiembroTipificado);
                                        if (elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION]) {
                                            if (elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_ELEMENTO_PREFIX]) {
                                                var prefijo = elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_ELEMENTO_PREFIX];
                                                if (elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_PREFIJO_ELEMENTO_XMLNS + prefijo]) {
                                                    var xmlns = elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_PREFIJO_ELEMENTO_XMLNS + prefijo];
                                                    if (xmlns === XbrlDesgloseCreditosController.ESPACIO_NOMRES_DIMENSION_INSTITUCION) {
                                                        if (elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_ELEMENTO_TEXT]) {
                                                            valorDimensionInstitucion = elementoMiembroTipificado[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_ELEMENTO_TEXT];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (contexto.ValoresDimension[j].QNameDimension === XbrlDesgloseCreditosController.QNAME_DIMENSION_DENOMINACION) {
                                            qNameMiembroDenominacion = contexto.ValoresDimension[j].QNameItemMiembro;
                                        }
                                        if (contexto.ValoresDimension[j].QNameDimension === XbrlDesgloseCreditosController.QNAME_DIMENSION_INTERVALO_TIEMPO) {
                                            qNameMiembroIntervalo = contexto.ValoresDimension[j].QNameItemMiembro;
                                        }
                                    }
                                    copiaComparar.splice(k, 1);
                                    break;
                                }
                            }
                            if (!equivalenteEncontrado) {
                                equivalente = false;
                                break;
                            }
                        }
                        if (equivalente && valorDimensionInstitucion !== null) {
                            if (valorDimensionInstitucion != 'TOTAL') {
                                //console.log(valorDimensionInstitucion);
                                self.agregaIndicesDimensionInstitucion(null, contexto, valorDimensionInstitucion, qNameMiembroIntervalo, qNameMiembroDenominacion, contexto.Periodo.Tipo)
                                var hechos = documentoInstancia.HechosPorIdContexto[contexto.Id];
                                if (hechos && hechos.length && hechos.length > 0) {
                                    for (var l = 0; l < hechos.length; l++) {
                                        var hecho = documentoInstancia.HechosPorId[hechos[l]];
                                        self.agregaIndicesDimensionInstitucion(hecho.IdConcepto, contexto, valorDimensionInstitucion, qNameMiembroIntervalo, qNameMiembroDenominacion, contexto.Periodo.Tipo);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            self.$scope.agregarValorDimensionInstitucion = function (idElementoPrimario: string): void {
                var intentos = 1;
                var nombreNuevoElemento: string = XbrlDesgloseCreditosController.PREFIJO_NOMBRE_INSTITUCION_DEFECTO;
                if (self.$scope.valoresDimensionInstitucion) {
                    while ($.inArray(nombreNuevoElemento, self.$scope.valoresDimensionInstitucion) != -1) {
                        nombreNuevoElemento = XbrlDesgloseCreditosController.PREFIJO_NOMBRE_INSTITUCION_DEFECTO + ' ' + intentos++;
                    }
                }

                if ($.inArray(nombreNuevoElemento, self.$scope.valoresDimensionInstitucion) == -1) {
                    self.$scope.valoresDimensionInstitucion.push(nombreNuevoElemento);
                }

                if (!self.$scope.valoresDimensionInstitucionPorElementoPrimario[idElementoPrimario]) {
                    self.$scope.valoresDimensionInstitucionPorElementoPrimario[idElementoPrimario] = new Array<string>();
                    self.$scope.valoresTemporalDimensionInstitucionPorElementoPrimario[idElementoPrimario] = new Array<string>();
                }
                if ($.inArray(nombreNuevoElemento, self.$scope.valoresDimensionInstitucionPorElementoPrimario[idElementoPrimario]) == -1) {
                    self.$scope.valoresDimensionInstitucionPorElementoPrimario[idElementoPrimario].push(nombreNuevoElemento);
                    self.$scope.valoresTemporalDimensionInstitucionPorElementoPrimario[idElementoPrimario].push(nombreNuevoElemento);
                }

                self.$scope.idUltimoCampo = 'FinDesglose';
                self.$scope.ultimoCampo = false;
                $('.scrollable').expire('#' + self.$scope.idUltimoCampo);
                $('.scrollable').livequery('#' + self.$scope.idUltimoCampo, function () {
                    self.$timeout(function () {
                        self.$scope.ultimoCampo = true;
                    });

                    $('.scrollable').expire('#' + self.$scope.idUltimoCampo);
                });


            }


            self.$scope.obtenerValorHechoDesgloseCreditos1 = function (hecho:model.Hecho): string {

                var valorHecho = "";

                if (hecho != null) {
                    var concepto = self.abaxService.getDocumentoInstancia().obtenerConceptoPorId(hecho.IdConcepto);
                    var tipoDato = abaxXBRL.model.TiposDatoXbrl.getInstance().get()[concepto.TipoDatoXbrl];

                    valorHecho = hecho.ValorHecho;

                    if (hecho.EsNumerico) {
                        valorHecho = hecho.ValorHecho;

                    } else {

                        if (tipoDato.Nombre == "booleanItemType") {
                            valorHecho = valorHecho == "0" || valorHecho == "false" ? "NO" : "SI";
                        }
                    }
                }

                return valorHecho;
            }

            self.$scope.obtenerHecho = function (idConcepto: string, valorDimensionInstitucion: string, miembroIntervaloTiempo: string, miembroMoneda: string, esPeriodoDuracion: boolean, idUnidad: string): model.Hecho {
                var idContexto = self.$scope.obtenerIdContexto(valorDimensionInstitucion, miembroIntervaloTiempo, miembroMoneda, esPeriodoDuracion);
                if (idUnidad != null)
                    idUnidad = self.$scope.idUnidadMoneda;

                var hecho = self.abaxService.getDocumentoInstancia().obtenerHecho(idConcepto, idContexto, idUnidad);
                

                return hecho;
            }


            
            self.$scope.obtenerValorHechoDesgloseCreditos = function (idDivHecho:string, idConcepto: string, valorDimensionInstitucion: string, miembroIntervaloTiempo: string, miembroMoneda: string, esPeriodoDuracion: boolean,idUnidad:string):void {
                var idContexto = self.$scope.obtenerIdContexto(valorDimensionInstitucion, miembroIntervaloTiempo, miembroMoneda, esPeriodoDuracion);
                if (idUnidad != null)
                    idUnidad = self.$scope.idUnidadMoneda;

                var hecho = self.abaxService.getDocumentoInstancia().obtenerHecho(idConcepto, idContexto, idUnidad);
                var concepto = self.abaxService.getDocumentoInstancia().obtenerConceptoPorId(idConcepto);
                var tipoDato = abaxXBRL.model.TiposDatoXbrl.getInstance().get()[concepto.TipoDatoXbrl];
                
                if (hecho != null) {
                    var valorHecho = hecho.ValorHecho;

                    if (hecho.EsNumerico) {
                        valorHecho = hecho.ValorHecho;

                        $('#' + idDivHecho).empty().append(valorHecho);
                        if (self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario > 0 && tipoDato.Nombre == "monetaryItemType") {
                            shared.service.AbaxXBRLUtilsService.inicializaAutoNumericPorTipoDatoPersonalizado($('#' + idDivHecho), tipoDato, self.abaxService.getDocumentoInstancia().NumeroDecimalesTipoDatoMonetario);
                        } else {
                            shared.service.AbaxXBRLUtilsService.inicializaAutoNumericPorTipoDato($('#' + idDivHecho), tipoDato);
                        }

                    } else {

                        if (tipoDato.Nombre == "booleanItemType") {
                            valorHecho = valorHecho == "0" ? "NO" : "SI";
                        }

                        $('#' + idDivHecho).empty().append(valorHecho);
                    }
                }
            }

            self.$scope.obtenerIdContexto = function (valorDimensionInstitucion: string, miembroIntervaloTiempo: string, miembroMoneda: string, esPeriodoDuracion: boolean): string {

                var qNameMiembroIntervaloTiempo = XbrlDesgloseCreditosController.ESPACIO_NOMBRES_DIMENSION_INTERVALO_DE_TIEMPO + ':' + miembroIntervaloTiempo;
                var qNameMiembroMoneda = XbrlDesgloseCreditosController.ESPACIO_NOMBRES_DIMENSION_DENOMINACION + ':' + miembroMoneda;
                var tipoPeriodo: number = esPeriodoDuracion == true ? abaxXBRL.model.Periodo.DURACION : abaxXBRL.model.Periodo.INSTANTE;
                var dInicio = moment(fechaInicioPeriodo + '0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc().toDate();
                var dFin = moment(fechaFinTrimestre + '0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc().toDate();


                if (self.$scope.contextosPorLlaveDimension[valorDimensionInstitucion] &&
                    self.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervaloTiempo] &&
                    self.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervaloTiempo][qNameMiembroMoneda] &&
                    self.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervaloTiempo][tipoPeriodo]) {
                    var encontrada = self.$scope.contextosPorLlaveDimension[valorDimensionInstitucion][qNameMiembroIntervaloTiempo][qNameMiembroMoneda][tipoPeriodo];
                    //console.log("obtenerIdContexto: [" + valorDimensionInstitucion + "][" + qNameMiembroIntervaloTiempo + "][" + qNameMiembroMoneda + "] = " + encontrada );
                    self.reEvaluaElementosPlantilla();
                    return encontrada;
                }
                //console.log("obtenerIdContexto: [" + valorDimensionInstitucion + "][" + qNameMiembroIntervaloTiempo + "][" + qNameMiembroMoneda + "] = null");
                var idsContextos: Array<string> = self.$scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion];
                var existe = false;
                if (idsContextos && idsContextos.length && idsContextos.length > 0) {
                    var idContextoResultado: string = null;
                    for (var index: number = 0; index < idsContextos.length; index++) {
                        var idContexto = idsContextos[index];
                        var contexto: model.Contexto = self.abaxService.getDocumentoInstancia().ContextosPorId[idContexto];
                        if (!contexto || contexto == null) {
                            continue;
                        }
                        if (!contexto.ValoresDimension || contexto.ValoresDimension == null || !contexto.ValoresDimension.length) {
                            continue;
                        }

                        if (contexto.Periodo.Tipo != tipoPeriodo) {
                            continue;
                        }

                        if (contexto.Periodo.Tipo == abaxXBRL.model.Periodo.INSTANTE) {
                            if (contexto.Periodo.FechaInstante.getTime() != dFin.getTime()) {
                                continue;
                            }
                        } else {
                            if (contexto.Periodo.FechaInicio.getTime() != dInicio.getTime() || contexto.Periodo.FechaFin.getTime() != dFin.getTime()) {
                                continue;
                            }
                        }

                        var mismoMiembroIntervalo: boolean = false;
                        var mismoMiembroDenominacion: boolean = false;
                        for (var indexDimension: number = 0; indexDimension < contexto.ValoresDimension.length; indexDimension++) {
                            var dimension: model.DimensionInfo = contexto.ValoresDimension[indexDimension];
                            if (dimension.QNameItemMiembro == qNameMiembroIntervaloTiempo) {
                                mismoMiembroIntervalo = true;
                            }
                            if (dimension.QNameItemMiembro == qNameMiembroMoneda) {
                                mismoMiembroDenominacion = true;
                            }
                        }
                        if (mismoMiembroIntervalo && mismoMiembroDenominacion) {
                            existe = true;
                            idContextoResultado = idContexto;
                        }
                    }
                }
                if (!existe) {
                    var contextoDenominacionIntervalo = self.crearContextoDeDesgloseDeCreditos(valorDimensionInstitucion, qNameMiembroIntervaloTiempo, qNameMiembroMoneda, emisora, esquemaEmisora, tipoPeriodo, fechaInicioPeriodo, fechaFinTrimestre);
                    self.agregaIndicesDimensionInstitucion(null, contextoDenominacionIntervalo, valorDimensionInstitucion, qNameMiembroIntervaloTiempo, qNameMiembroMoneda, tipoPeriodo);
                    idContextoResultado = contextoDenominacionIntervalo.Id;
                }
                self.reEvaluaElementosPlantilla();
                return idContextoResultado;
            }

            self.$scope.eliminarElementosDimensionInstitucion = function (valorDimensionInstitucion: string, idElementoPrimario: string): void {

                var si = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('DESGLOSE_CREDITOS_SI');
                var no = shared.service.AbaxXBRLUtilsService.getValorEtiqueta('DESGLOSE_CREDITOS_NO');

                $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('DESGLOSE_CREDITOS_ELIMINAR_INSTITUCION', {
                    'valorDimensionInstitucion': valorDimensionInstitucion
                }), {
                        title: shared.service.AbaxXBRLUtilsService.getValorEtiqueta('DESGLOSE_CREDITOS_ELIMINAR_INSTITUCION'),
                        buttons: { si: true, no: false },
                        submit: function (e, v, m, f) {
                            if (v) {
                                var scope = self.$scope;
                                scope.$apply(function () {
                                    //Primero eliminamos todos los hechos del documento de instancia.
                                    var contexto: model.Contexto;
                                    var contextosIds: Array<string> = scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion];
                                    var contextoTotales: string = scope.contextoTotalesPorDimensionInstitucion[valorDimensionInstitucion];
                                    var idsConceptos: Array<string> = [];
                                    contextosIds.push(contextoTotales);
                                    //Iteramos hechos.
                                    for (var indexContexto: number = 0; indexContexto < contextosIds.length; indexContexto++) {
                                        var idContexto: string = contextosIds[indexContexto];
                                        var hechosIds: Array<string> = angular.copy(self.abaxService.getDocumentoInstancia().HechosPorIdContexto[idContexto]);
                                        if (hechosIds && hechosIds != null && hechosIds.length > 0) {
                                            for (var indexHechoId: number = 0; indexHechoId < hechosIds.length; indexHechoId++) {

                                                var idHecho = hechosIds[indexHechoId];
                                                var hecho = self.abaxService.getDocumentoInstancia().HechosPorId[idHecho];
                                                if (hecho && hecho != null) {
                                                    var idConcepto = hecho.IdConcepto;
                                                    if (idsConceptos.indexOf(idConcepto) == -1) {
                                                        idsConceptos.push(idConcepto);
                                                    }
                                                }

                                                self.abaxService.eliminarHechoDeDocumentoInstanciaPorId(idHecho);
                                            }
                                        }
                                    }
                                    // Eliminamos los contextos del documeno de instancia.
                                    var hechosPorIdContexto: { [id: string]: Array<string> } = self.abaxService.getDocumentoInstancia().HechosPorIdContexto;
                                    var contextosPorId: { [idContexto: string]: model.Contexto } = self.abaxService.getDocumentoInstancia().ContextosPorId;
                                    var gruposContextosEquivalentes: { [id: string]: Array<string> } = self.abaxService.getDocumentoInstancia().GruposContextosEquivalentes;
                                    var contextosPorFecha: { [fecha: string]: Array<string> } = self.abaxService.getDocumentoInstancia().ContextosPorFecha;
                                    //Iteramos todos los contextos por id.
                                    for (var indexContexto: number = 0; indexContexto < contextosIds.length; indexContexto++) {

                                        var idContexto: string = contextosIds[indexContexto];

                                        //Borramos el arreglo de hechos del diccionario.
                                        hechosPorIdContexto[idContexto] = undefined;
                                        delete hechosPorIdContexto[idContexto];

                                        var contextosEquivalentes: Array<string> = angular.copy(gruposContextosEquivalentes[idContexto]);
                                        //Borramos el idContexto del arreglo de equivalentes de sus equivalentes.
                                        if (contextosEquivalentes && contextosEquivalentes != null && contextosEquivalentes.length > 0) {
                                            for (var indexContextoEquivalente: number = 0; indexContextoEquivalente < contextosEquivalentes.length; indexContextoEquivalente++) {
                                                var idContextoEquivalente: string = contextosEquivalentes[indexContextoEquivalente];
                                                var idsContexotsEquivalentes2: Array<string> = gruposContextosEquivalentes[idContextoEquivalente];
                                                var indexContextoEquivalente2 = $.inArray(idContexto, idsContexotsEquivalentes2);
                                                if (indexContextoEquivalente2 != -1) {
                                                    idsContexotsEquivalentes2.splice(indexContextoEquivalente2, 1);
                                                }

                                            }
                                            //Borramos el arreglo de elementos equivalentes del diccionario.
                                            gruposContextosEquivalentes[idContexto] = undefined;
                                            delete gruposContextosEquivalentes[idContexto];
                                        }

                                        //Eliminamos los contextos del diccionario por fechas.
                                        var fechaInicioPeriodo: string = definicionPlantilla.obtenerVariablePorId('fecha_2015_01_01');
                                        var fechaFinTrimestre: string = definicionPlantilla.obtenerVariablePorId('fecha_2015_09_30');
                                        var contextosInstante: Array<string> = contextosPorFecha[fechaFinTrimestre];
                                        var contextosDuracion: Array<string> = contextosPorFecha[fechaInicioPeriodo + '_' + fechaFinTrimestre];
                                        //Instante.
                                        var indexInstante = $.inArray(idContexto, contextosInstante);
                                        if (indexInstante != -1) {
                                            contextosInstante.splice(indexInstante, 1);
                                        }
                                        //Duracion
                                        var indexDuracion = $.inArray(idContexto, contextosDuracion);
                                        if (indexInstante != -1) {
                                            contextosDuracion.splice(indexDuracion, 1);
                                        }

                                        //Borramos el contexto del diccionario base.
                                        contextosPorId[idContexto] = undefined;
                                        delete contextosPorId[idContexto];

                                    }

                                    //Despues eliminamos todos los elementos de la dimensión institución de los indices del desglose de creditos.

                                    //Indice de contextos totales
                                    scope.contextoTotalesPorDimensionInstitucion[valorDimensionInstitucion] = undefined;
                                    delete scope.contextoTotalesPorDimensionInstitucion[valorDimensionInstitucion];
                                    //Indice de contextos no totales.
                                    scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion] = undefined;
                                    delete scope.contextosPorValorDimensionInstitucion[valorDimensionInstitucion];
                                    //Indice por contexto primario
                                    var nombreInstituciones = scope.valoresDimensionInstitucionPorElementoPrimario[idElementoPrimario];
                                    var indexDimension = $.inArray(valorDimensionInstitucion, nombreInstituciones);
                                    if (indexDimension != -1) { nombreInstituciones.splice(indexDimension, 1); }
                                    //Indice temporal por contexto primario
                                    nombreInstituciones = scope.valoresTemporalDimensionInstitucionPorElementoPrimario[idElementoPrimario];
                                    indexDimension = $.inArray(valorDimensionInstitucion, nombreInstituciones);
                                    if (indexDimension != -1) { nombreInstituciones.splice(indexDimension, 1); }
                                    //Indice general
                                    nombreInstituciones = scope.valoresDimensionInstitucion;
                                    indexDimension = $.inArray(valorDimensionInstitucion, nombreInstituciones);
                                    if (indexDimension != -1) { nombreInstituciones.splice(indexDimension, 1); }
                                    //Mapa on los elementos por dimensión.
                                    scope.contextosPorLlaveDimension[valorDimensionInstitucion] = undefined;
                                    delete scope.contextosPorLlaveDimension[valorDimensionInstitucion];

                                    //Reevaluamos las formulas de los conceptos relacionados a los hechos eliminados.
                                    for (var indexConcepto: number = 0; indexConcepto < idsConceptos.length; indexConcepto++) {
                                        var idConcepto = idsConceptos[indexConcepto];
                                        self.abaxService.reevaluaFormulasPorConcepto(idConcepto);
                                    }
                                    $('xbrl\\:campo-captura').xbrlCampoCaptura('update');
                                    abaxXBRL.plugins.AngularJQueryBridge.getInstance().obtenerDocumentoInstancia().PendienteGuardar = true;
                                    //plugins.AngularJQueryBridge.getInstance().obtenerScopeAngular().$apply();
                                });
                            }
                        }
                    });
            }

            var documentoInstnacia = this.abaxService.getDocumentoInstancia();
            this.tableSettings = new plugins.XbrlTablaExcelSettings();
            this.tableSettings.estilos = plugins.XbrlTablaExcel.ESTILOS_POR_DEFECTO;
            this.tableSettings.soloLectura = documentoInstnacia.BloquearCamposCaptura;
            this.tableSettings.tabIndex = 1;
            this.tableSettings.contenedorTextArea = $(plugins.XbrlTablaExcel.CONTENEDOR_CLIPBOARD_POR_DEFECTO);
            this.tableSettings.onAfterPaste = plugins.XbrlPluginUtils.onAfterPaste;
            this.tableSettings.onAfterRangePaste = plugins.XbrlPluginUtils.onAfterRangePaste;
            this.tableSettings.onBeforeCopy = plugins.XbrlPluginUtils.onBeforeCopy;
            this.tableSettings.onSpaceOrEnterKey = plugins.XbrlPluginUtils.onSpaceOrEnterKey;
        }



        /**
         * Crea un contexto para su uso en el desglose de créditos a partir de los valores dimensionales especificados y las características solicitadas para el nuevo contexto.
         *
         * @param valorDimensionInstitucion el valor de la dimensión tipificada institución.
         * @param qNameMiembroIntervaloTiempo el nombre calificado del miembro para la dimensión intervalo de tiempo.
         * @param qNameMiembroDenominacion el nombre calificado del miembro para la dimensión denominación.
         * @param emisora el nombre de la emisora para la entidad del contexto.
         * @param esquemaEmisora el esquema en que se definió  el nombre de la emisora para la entidad del contexto.
         * @param tipo el tipo de contexto (duración o instante).
         * @param fechaInicio la fecha que sirve como instante o como inicio del periodo de duración del periodo del contexto.
         * @param fechaFin la fecha que sirve como fin para el periodo del contexto en caso de ser de tipo duración.
         * @return el contexto creado a partir de las características proporcionadas.
         */
        private crearContextoDeDesgloseDeCreditos(valorDimensionInstitucion: string, qNameMiembroIntervaloTiempo: string, qNameMiembroDenominacion: string, emisora: string, esquemaEmisora: string, tipo: number, fechaInicio: string, fechaFin?: string): abaxXBRL.model.Contexto {
            var contexto = new abaxXBRL.model.Contexto();

            contexto.ContieneInformacionDimensional = false;
            contexto.Escenario = null;
            contexto.Id = "CDC" + abaxXBRL.utils.UUIDUtils.generarUUID();
            contexto.ValoresDimension = null;
            contexto.Periodo = new abaxXBRL.model.Periodo();

            contexto.Periodo.Tipo = tipo;
            if (contexto.Periodo.Tipo == abaxXBRL.model.Periodo.INSTANTE) {
                contexto.Periodo.FechaInstante = moment(fechaFin + '0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc().toDate();
            }
            if (contexto.Periodo.Tipo == abaxXBRL.model.Periodo.DURACION) {
                contexto.Periodo.FechaInicio = moment(fechaInicio + '0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc().toDate();
                contexto.Periodo.FechaFin = moment(fechaFin + '0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc().toDate();
            }

            contexto.Entidad = new abaxXBRL.model.Entidad();
            contexto.Entidad.Id = emisora;
            contexto.Entidad.EsquemaId = esquemaEmisora;
            contexto.Entidad.IdEntidad = esquemaEmisora + abaxXBRL.model.ConstantesComunes.SEPARADOR_NOMBRE_CALIFICADO + emisora;
            contexto.Entidad.ContieneInformacionDimensional = false;
            contexto.ContieneInformacionDimensional = true;
            contexto.Escenario = null;
            contexto.ValoresDimension = new Array<abaxXBRL.model.DimensionInfo>();

            var dimensionDenominacion = new abaxXBRL.model.DimensionInfo();

            dimensionDenominacion.Explicita = true;
            dimensionDenominacion.QNameDimension = XbrlDesgloseCreditosController.QNAME_DIMENSION_DENOMINACION;
            dimensionDenominacion.IdDimension = XbrlDesgloseCreditosController.ID_DIMENSION_DENOMINACION;
            dimensionDenominacion.QNameItemMiembro = qNameMiembroDenominacion;
            dimensionDenominacion.IdItemMiembro = this.ID_ITEM_MIEMBRO_POR_QNAME[qNameMiembroDenominacion];

            contexto.ValoresDimension.push(dimensionDenominacion);

            var dimensionIntervaloTiempo = new abaxXBRL.model.DimensionInfo();

            dimensionIntervaloTiempo.Explicita = true;
            dimensionIntervaloTiempo.QNameDimension = XbrlDesgloseCreditosController.QNAME_DIMENSION_INTERVALO_TIEMPO;
            dimensionIntervaloTiempo.IdDimension = XbrlDesgloseCreditosController.ID_DIMENSION_INTERVALO_TIEMPO;
            dimensionIntervaloTiempo.QNameItemMiembro = qNameMiembroIntervaloTiempo;
            dimensionIntervaloTiempo.IdItemMiembro = this.ID_ITEM_MIEMBRO_POR_QNAME[qNameMiembroIntervaloTiempo];

            contexto.ValoresDimension.push(dimensionIntervaloTiempo);

            var dimensionInstitucion = new abaxXBRL.model.DimensionInfo();

            dimensionInstitucion.Explicita = false;
            dimensionInstitucion.QNameDimension = XbrlDesgloseCreditosController.QNAME_DIMENSION_INSTITUCION;
            dimensionInstitucion.IdDimension = XbrlDesgloseCreditosController.ID_DIMENSION_INSTITUCION;

            var plantillaXml = abaxXBRL.utils.XmlUtils.CrearJsonAPartirDeXml(XbrlDesgloseCreditosController.TEMPLATE_VALOR_DIMENSION_INSTITUCION);
            plantillaXml[XbrlDesgloseCreditosController.NOMBRE_DIMENSION_INSTITUCION][XbrlDesgloseCreditosController.X2JS_ELEMENTO_TEXT] = valorDimensionInstitucion;
            dimensionInstitucion.ElementoMiembroTipificado = abaxXBRL.utils.XmlUtils.CrearXmlAPartirDeJson(plantillaXml);

            contexto.ValoresDimension.push(dimensionInstitucion);

            this.abaxService.inyectarContextoADocumentoInstancia(contexto);

            return contexto;
        }

        /**
         * Constructor de la clase AbaxXBRLController
         *
         * @param $scope el scope del controlador
         * @param abaxXBRLServices el servicio de negocio para interactuar con el back end.
         */
        constructor($scope: IXbrlDesgloseCreditosScope, abaxXBRLServices: services.AbaxXBRLServices, $timeout: ng.ITimeoutService) {
            var self = this;

            this.$scope = $scope;
            this.abaxService = abaxXBRLServices;
            this.$timeout = $timeout;
            //plugins.XbrlPluginUtils.presentarLoaderFormatos();
            
            this.init();
            //this.reEvaluaElementosPlantilla();

            this.inicializarDetalleInstituciones();

        }
    }
    XbrlDesgloseCreditosController.$inject = ['$scope', 'abaxXBRLServices', '$timeout'];

    /**
     * Define la estructura del Scope de la Directiva para la edición / visualización de datos de tipo numérico
     *
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export interface IXbrlDesgloseCreditosScope extends ng.IScope {

        /** Agrupa los diferentes valores de la dimensión tipificada institución */
        valoresDimensionInstitucion: Array<string>;

        /** Agrupa los diferentes valores de la dimensión tipificada institución de acuerdo a su uso en los diferentes elementos primarios */
        valoresDimensionInstitucionPorElementoPrimario: { [idElementoPrimario: string]: Array<string> };

        /** Copia de los valores utilizados en la dimensión tipificada institución para poder detectar cambios en los valores y propagarlos al modelo final */
        valoresTemporalDimensionInstitucionPorElementoPrimario: { [idElementoPrimario: string]: Array<string> };

        /** Agrupa los contextos por el valor de la dimensión tipificada institución para una acceso más rápido */
        contextosPorValorDimensionInstitucion: { [valorDimensionInstitucion: string]: Array<string> };

        /** Agrupa los contextos por la combinación de sus valores dimensionales para una acceso más rápido */
        contextosPorLlaveDimension: { [valorDimensionInstitucion: string]: { [qNameMiembroIntervalo: string]: { [qNameMiembroDimension: string]: { [tipoPeriodo: number]: string } } } };

        /** Agrupoa los contextos totales por el valor de la dimensión tipificada institución para una acceso más rápido */
        contextoTotalesPorDimensionInstitucion: { [valorDimensionInstitucion: string]: string };


        /**
         * Agrega un valor a la dimensión institución verificando que no se encuentre duplicado.
         *
         * @param idElementoPrimario el identificador del elemento primario que desea utilizar el valor de la dimensión
         * @param nombreInstitucion el identificador 
         */
        agregarValorDimensionInstitucion(idElementoPrimario: string): void;

        

        /**
         * Obtiene el identificador del contexto que contiene los valores dimensionales proporcionados como parámetros. Si no existe, lo crea.
         *
         * @param valorDimensionInstitucion el valor como cadena que deberá contener la dimensión tipificada institución.
         * @param idMiembroIntervaloTiempo el identificador del miembro de la dimensión explíctica intervalo de tiempo
         * @param idMiembroMoneda el identificador del miembro de la dimensión explíctica moneda
         * @param esPeriodoDuracion Bandera que indica si el periodo es de tipo duración (true) o instante (false).
         */
        obtenerIdContexto(valorDimensionInstitucion: string, idMiembroIntervaloTiempo: string, idMiembroMoneda: string, esPeriodoDuracion: boolean): string;

        /**
         * Obtiene el valor del hecho del desglose de créditos
         * @param idDivHecho el valor del identificador del hecho.
         * @param concepto el valor como cadena que deberá contener la dimensión tipificada institución.
         * @param valorDimensionInstitucion el valor como cadena que deberá contener la dimensión tipificada institución.
         * @param idMiembroIntervaloTiempo el identificador del miembro de la dimensión explíctica intervalo de tiempo
         * @param idMiembroMoneda el identificador del miembro de la dimensión explíctica moneda
         * @param esPeriodoDuracion Bandera que indica si el periodo es de tipo duración (true) o instante (false).
         * @param idUnidad Identificador de la unidad del hecho.
        */
        obtenerValorHechoDesgloseCreditos(idDivHecho: string, concepto: string, valorDimensionInstitucion: string, idMiembroIntervaloTiempo: string, idMiembroMoneda: string, esPeriodoDuracion: boolean, idUnidad: string): void;
        obtenerValorHechoDesgloseCreditos1(hecho: model.Hecho): string;

        obtenerHecho(concepto: string, valorDimensionInstitucion: string, idMiembroIntervaloTiempo: string, idMiembroMoneda: string, esPeriodoDuracion: boolean, idUnidad: string): model.Hecho;


        /**
         * Obtiene el identificador de la unidad de acuerdo a lo definido por la plantilla.
         *
         * @return el identificador de la unidad de tipo moneda de la plantilla actual.
         */
        obtenerIdUnidadMoneda(): string;

        /**
         * Obtiene el identificador de la unidad de acuerdo a lo definido por la plantilla.
         *
         * @return el identificador de la unidad de tipo pure de la plantilla actual.
         */
        obtenerIdUnidadPure(): string;

        /**
         * Obtiene el identificador del hecho a capturar que pertenezca al contexto de los valores totales de las dimensiones explícitas del desglos de créditos. Si no existe el hecho, lo crea.
         *
         * @param valorDimensionInstitucion el valor que deberá tener el contexto en la dimensión tipificada institución.
         * @return el identificador del hecho para capturar.
         */
        obtenerIdHecho(valorDimensionInstitucion: string): string;

        /** Valor por defecto que será asignado a los campos fecha **/
        valorDefaultFecha: string;

        /** Identificador de la unidad moenda que será utilizada para los hechos de moneda. **/
        idUnidadMoneda: string;

        /** Identificador de la unidad moenda que será utilizada para los hechos de moneda. **/
        idUnidadPure: string;

        /** 
        * Elimina los contextos y hechos relacionados a una dimensión Institución 
        * @param valorDimensionInstitucion Nombre de la dimensión institución que se pretende eliminar.
        * @param idContextoPrimario Identificador del contexto primario al que pertenece la dimensión institución.
        **/
        eliminarElementosDimensionInstitucion(valorDimensionInstitucion: string, idContextoPrimario): void;

        /** Indica si se trata del último campo en aparecer en pantalla */
        ultimoCampo: boolean;

        /** El identificador del último campo que aparece en pantalla */
        idUltimoCampo: string;

        /** Actualiza el estatus del último campo en aparecer en pantalla */
        actualizarUltimoCampo(): boolean;

    }

    /**
     * Implementación de una directiva para presentar el desglose de créditos.
     *
     * @author José Antonio Huizar Moreno
     * @version 1.0
     */
    export class XbrlDesgloseCreditos {

        /**
         * Obtiene la definición de la directiva.
         *
         * @return la definición de la directiva.
         */
        public static XbrlDesgloseCreditosDirective(): ng.IDirective {

            return {
                restrict: 'A',
                controller: XbrlDesgloseCreditosController
            };
        }
    }


    /**Dto del campo de texto para poder hacer uso de la propiedad model. **/
    export interface IXbrlCampoTextoDto {
        /**Valor de campo de texto. **/
        valor: string;
    }

    /**Campo de captura de texto generico. **/
    export interface IXbrlCampoTextoGenericoDirectiveScope extends ng.IScope {

        /** Valor con el que se inicializa el campo de captura.**/
        xbrlValor: string;

        /** El valor temporal que almacena los posibles cambios al modelo */
        valorTemporal: IXbrlCampoTextoDto;

        /** La lista de valores contra la cual se compara el modelo */
        xbrlListaValores: Array<string>;

        /** 
        * Listener que será invocado cada vez que cambie el valor  del campo.
        * @param newValue Valor actual del campo de texto.
        * @param oldValue Valor anterior del campo de texto.
        **/
        xbrlChangeValueListener(any): void;

        /** Si ses esta mostrando el input para modificación del valor del campo. **/
        editando: boolean;

        /** Se encarga de procesar el evento blur del editor */
        manejarBlur(): void;

        /**Etiqueta que contiene el elemento "xbrl:campo-texto-generico" **/
        padre: JQuery;


        /**Bandera que indica que el componente esta contenido dentro de una directiva de tabla de excel. **/
        contenidoEnTablaExcel: boolean;

    }

    /**Clase que implementa la fabrica de la directiva de campo de texto generico. **/
    export class XbrlCampoTextoGenerico {

        /** 
        * Método utilizado por angular para la generación de la directiva.
        *
        * @return Objeto con datos de configuración para la generación de la nueva directiva.
        */
        public static XbrlCampoTextoGenericoDirective(): ng.IDirective {
            return {
                restrict: 'E',
                scope: {
                    xbrlValor: '@',
                    xbrlChangeValueListener: '&',
                    xbrlListaValores: '='
                },
                require: ['?^xbrlTablaExcel'],
                controller: XbrlCampoTextoGenericoController,
                templateUrl: "ts/templates/taxonomias/ifrs_mx_20141205/extensions/template-xbrl-texto-generico.html?version=" + root.AbaxXBRLConstantesRoot.VERSION_APP.version,
                link: function ($scope: IXbrlCampoTextoGenericoDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: any) {
                    
                    $scope.contenidoEnTablaExcel = false;
                    //Si se inyectaron controladores
                    if (controllers && controllers.length && controllers.length > 0) {
                        //Iteramos los controladores inyectados y asignamos a los controllers segun corresponda.
                        var index: number;
                        /*for (index = 0; index < controllers.length; index++) {
                            if (controllers[index] instanceof abaxXBRL.directives.XbrlTablaExcelController) {
                                $scope.tablaExcelController = controllers[index];
                                $scope.contenidoEnTablaExcel = true;
                                continue;
                            }
                        }*/
                    }
                }
            };
        }
    }

    /**Clase que define el controlador para la dierctiva de campo generico. **/
    export class XbrlCampoTextoGenericoController {
        /**Scope de la directiva de campo de texto generico. **/
        private $scope: IXbrlCampoTextoGenericoDirectiveScope;
        /**Elemento JQuery de dom del campo de texto generico. **/
        private $element: ng.IAugmentedJQuery;

        private ctrlSelf = this;

        private mostrarEditor() {
            var self = this;
            self.$scope.$apply(function () {
                self.$scope.editando = true;
            });

            //$('table[xbrl\\:tabla-excel]').xbrlTablaExcel('pausar');
            self.$scope.padre.off('dblclick');
            self.$element.find('input').focus();

        }

        private mostrarVisor(): void {
            var self = this;
            self.$scope.padre.on('dblclick', function () { self.mostrarEditor(); });
        }

        /**Método donde se inicializan los componentes del scope y el controlador. **/
        private init(): void {
            var self = this;
            self.$scope.editando = false;

            self.$scope.valorTemporal = { valor: self.$scope.xbrlValor };
            this.$scope.padre = self.$element.parent();

            self.$scope.manejarBlur = function () {

                if (self.$scope.xbrlValor !== self.$scope.valorTemporal.valor) {
                    if (self.$scope.xbrlListaValores && $.inArray(self.$scope.valorTemporal.valor, self.$scope.xbrlListaValores) == -1) {
                        if (self.$scope.xbrlChangeValueListener) {
                            self.$scope.xbrlChangeValueListener({ newValue: self.$scope.xbrlValor, oldValue: self.$scope.valorTemporal.valor });
                        }
                        self.$scope.xbrlValor = self.$scope.valorTemporal.valor;
                    } else {
                        self.$scope.valorTemporal.valor = self.$scope.xbrlValor;
                        $.prompt(shared.service.AbaxXBRLUtilsService.getValorEtiqueta('DESGLOSE_CREDITOS_NOMBRE_INSTITUCION_UNICO'),
                            {
                                title: 'Error de datos',
                                buttons: { 'Aceptar': true }
                            });
                    }
                }
                self.$scope.editando = false;
                self.mostrarVisor();
                //$('table[xbrl\\:tabla-excel]').xbrlTablaExcel('reanudar');
            }

            self.mostrarVisor();
        }
        /**
        * Constructor del controlador.
        * @param $scope Scope de la directiva de campo de texto generico.
         **/
        constructor($scope: IXbrlCampoTextoGenericoDirectiveScope, $element: ng.IAugmentedJQuery) {
            this.$scope = $scope;
            this.$element = $element;
            this.init();
        }
    }
    /**Inicializamos los atricutos que deberán inyectarse al controller una vez generado. **/
    XbrlCampoTextoGenericoController.$inject = ['$scope', '$element'];


    var desgloseCreditosModule: ng.IModule = angular.module('abaxXBRLDesgloseCreditosViewer', ['abaxVisorXBRLViewer', 'pascalprecht.translate','tmh.dynamicLocale']);

    desgloseCreditosModule.controller('XbrlDesgloseCreditosController', abaxXBRL.templates.extensions.XbrlDesgloseCreditosController);
    desgloseCreditosModule.directive('xbrlDesgloseCreditos', abaxXBRL.templates.extensions.XbrlDesgloseCreditos.XbrlDesgloseCreditosDirective);

    desgloseCreditosModule.directive('xbrlCampoTextoGenerico', abaxXBRL.templates.extensions.XbrlCampoTextoGenerico.XbrlCampoTextoGenericoDirective);
    desgloseCreditosModule.controller('XbrlCampoTextoGenericoController', abaxXBRL.templates.extensions.XbrlCampoTextoGenericoController);

    desgloseCreditosModule.config(['$translateProvider', function ($translateProvider: ng.translate.ITranslateProvider) {

        $translateProvider.translations('en', {
            DESGLOSE_CREDITOS_NOMBRE_INSTITUCION_UNICO: 'The name assigned to the institution must be unique  El nombre de la institución debe ser único para cada renglón de datos del desglose de créditos.',
            DESGLOSE_CREDITOS_ERROR_DATOS: 'Data error',
            DESGLOSE_CREDITOS_ACEPTAR: 'Ok',
            DESGLOSE_CREDITOS_CONFIRMAR_ELIMINAR_INSTITUCION: 'Please confirm that you want to remove the data related to the institution: {{valorDimensionInstitucion}}.',
            DESGLOSE_CREDITOS_ELIMINAR_INSTITUCION: 'Delete institution',
            DESGLOSE_CREDITOS_SI: 'Yes',
            DESGLOSE_CREDITOS_NO: 'No'
        });

        $translateProvider.translations('es', {
            DESGLOSE_CREDITOS_NOMBRE_INSTITUCION_UNICO: 'El nombre de la institución debe ser único para cada renglón de datos del desglose de créditos.',
            DESGLOSE_CREDITOS_ERROR_DATOS: 'Error de datos',
            DESGLOSE_CREDITOS_ACEPTAR: 'Aceptar',
            DESGLOSE_CREDITOS_CONFIRMAR_ELIMINAR_INSTITUCION: '¿Esta seguro de que quiere eliminar todos los datos de la institución {{valorDimensionInstitucion}}?',
            DESGLOSE_CREDITOS_ELIMINAR_INSTITUCION: 'Eliminar Institución',
            DESGLOSE_CREDITOS_SI: 'Si',
            DESGLOSE_CREDITOS_NO: 'No'
        });

        $translateProvider.preferredLanguage('en');
    }]);



}