///<reference path="../../../modeloAbax.ts" /> 
///<reference path="../../../modeloPlantillaAbax.ts" /> 
///<reference path="../../../../scripts/typings/moment/moment.d.ts" />
module abaxXBRL.templates {

    /**
     * Implementación del Objeto de Plantilla de documento de instancia XBRL para la taxonomía de http://www.cnbv.gob.mx/2016-08-22/ar_prospectus/pros_HBIS3_entry_point_2016-08-22
     */
    export class http___www_cnbv_gob_mx_2016_08_22_ar_prospectus_pros_HBIS3_entry_point_2016_08_22 extends ArProsBasePlantilla implements abaxXBRL.model.DefinicionDePlantillaXbrl {

        /**
         * Contiene la definción de los parámetros de configuración utilizados por esta plantilla
         */
        DefinicionesParametrosConfiguracion: { [id: string]: abaxXBRL.model.DefinicionParametroConfiguracionPlantilla };

        /**
         * Contiene la definición de los elementos utilizados por las plantillas de los diferentes roles que componen la plantilla
         */
        DefinicionesElementos: abaxXBRL.model.DefinicionDeElementosPlantilla;

        /** El documento instancia que presenta esta plantilla */
        DocumentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl;

        /** Las variables que se calcularon para la plantilla del documento instancia en base a los parámetros de configuración. */
        VariablesDocumentoInstancia: { [id: string]: string };

        /** Indica que no fue capaz de determinar los parámetros de configuración del usuario */
        IncapazDeterminarParametrosConfiguracion: boolean;

        /** Los valores de los diferentes parámetros de configuración */
        ParametrosConfiguracion: { [id: string]: any } = {};

		/** Las llaves que identifican los diferentes grupos de periodos por fecha (instante o duración) */
        llavesPeriodo: Array<string>;

		/** Las entidades asociadas con el documento instancia */
        entidades: Array<model.EntidadPlantilla>;
        /** Información adicional asociada a la plantilla de taxonomía */
        informacionExtra: { [id: string]: any };
		/** El idioma por defecto para las etiquetas */
        IDIOMA_DEFAULT(): string { return 'es'; }
        /**
        * Diccionario de acciones.
        **/
        accionesPlantilla: { [nombreAccion: string]: () => any } = {}; 

		/** Muestra el diccioneadio de las etiquetas de las partes de una referencia por idioma. */
        EtiquetasParteReferencia: { [idioma: string]: { [nombreParte: string]: string } } = {};

        obtenerDefinicionDeParametrosDeConfiguracion(): { [id: string]: abaxXBRL.model.DefinicionParametroConfiguracionPlantilla } {
            return this.DefinicionesParametrosConfiguracion;
        }

        agregarDefinicionElementos(definicion: abaxXBRL.model.DefinicionDeElementosPlantilla): void {
            $.extend(true, this.DefinicionesElementos.ContextosPlantillaPorId, definicion.ContextosPlantillaPorId);
            $.extend(true, this.DefinicionesElementos.UnidadesPlantillaPorId, definicion.UnidadesPlantillaPorId);
            $.extend(true, this.DefinicionesElementos.HechosPlantillaPorId, definicion.HechosPlantillaPorId);
            $.extend(true, this.DefinicionesElementos.ListadoDeFormulas, definicion.ListadoDeFormulas);
        }

        obtenerDefinicionDeElementos(): abaxXBRL.model.DefinicionDeElementosPlantilla {
            return this.DefinicionesElementos;
        }

        determinarParametrosConfiguracion(): boolean {
            var resultado: boolean = true;
            this.ParametrosConfiguracion = {};
            resultado = this.determinarParametrosConfiguracionPros(this.ParametrosConfiguracion, this.DocumentoInstancia);
            return resultado;
        }

        /**
         * Inicializa la definición de la plantilla de un documento XBRL.
         *
         * @param documentoInstancia el documentoInstanciaXBRL que será presentado.
         */
        init(documentoInstancia: abaxXBRL.model.DocumentoInstanciaXbrl): void {
            this.DocumentoInstancia = documentoInstancia;

            if (!this.ParametrosConfiguracion || this.ParametrosConfiguracion == null) {
                if (!this.determinarParametrosConfiguracion()) {
                    this.IncapazDeterminarParametrosConfiguracion = true;
                    return;
                }
            }

            if (!this.generarVariablesDocumentoInstancia()) {
                this.IncapazDeterminarParametrosConfiguracion = true;
            }
        }

        /**
         * Genera las variables requeridas por el documento instancia.
         *
         * @return true si fue posible generar con éxito las variables. false en cualquier otro caso.
         */
        generarVariablesDocumentoInstancia(): boolean {

            var resultado: boolean = this.generarVariablesDocumentoInstanciaArPros(this.VariablesDocumentoInstancia, this.ParametrosConfiguracion, this.DocumentoInstancia);
            if (resultado) {
                var cierreAnoActual = moment().month(11).date(31).format("YYYY-MM-DD");
                //TODO: Determinar variables Documento Instancia        
                this.VariablesDocumentoInstancia['valorDefaultpros_PlacementProspectus'] = 'Anexo H Bis 3';
                this.VariablesDocumentoInstancia['valorDefaultpros_OnlyEmission'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultSupplement'] = 'Anexo H Bis 3';
                this.VariablesDocumentoInstancia['valorDefaultBrochure'] = 'Anexo H Bis 3';
                this.VariablesDocumentoInstancia['valorDefaultIssuanceUnderArt13OfTheCUE'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultLimitedPublicOffering'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultTypeOfInstrument'] = 'Fideicomisos';
                this.VariablesDocumentoInstancia['valorDefaultTypeOfInstrumentDescription'] = 'Certificados bursátiles fiduciarios inmobiliarios';
                this.VariablesDocumentoInstancia['valorDefaultForeingIssuer'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultMentioningPartialOrTotalDependence'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultCompanyIncorporatedSoThatTheTrustMeetsItsPurpose'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultTypeOfOffer'] = 'Primaria, Nacional';
                this.VariablesDocumentoInstancia['valorDefaultDesignationOfTheReferenceCurrencyInWhichTheProgramIsAuthorized'] = 'PESOS';
                this.VariablesDocumentoInstancia['valorDefaultNameOfTheReferenceCurrencyInWhichTheIssueIsMade'] = 'PESOS';
                this.VariablesDocumentoInstancia['valorDefaultInTheCaseOfAdditionalValues'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationGeneralInformation'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationTrust'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationAdministrator'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationFinancialInformationOfTheTrust'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationInternalManagement'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultReferenceIncorporationAnnex'] = 'NO';
                this.VariablesDocumentoInstancia['valorDefaultProspectusSupplementBrochure'] = 'Preeliminar';

                this.VariablesDocumentoInstancia['valorDefaultDebtSerieSettlementDate'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultDateOfPublicationOfTenderNotice'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultClosingDateBookOrAuction'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultDateOfRegisterInTheStockExchange'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultSettlementDate'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultDebtSerieSettlementDate'] = cierreAnoActual;
                this.VariablesDocumentoInstancia['valorDefaultSignificantParticipationInTheOffer'] = 'NO';

                
                var anio: Date = this.ParametrosConfiguracion["anio"];
                var numeroAnio = moment(anio).utc().year();
                var finAnio = moment(numeroAnio + '-12-31 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                var iniciAnio = moment(numeroAnio + '-01-01 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                var finAnioAnt = moment(numeroAnio - 1 + '-12-31 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                var iniciAnioAnt = moment(numeroAnio - 1 + '-01-01 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                var finAnioAntAnt = moment(numeroAnio - 2 + '-12-31 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                var iniciAnioAntAnt = moment(numeroAnio - 2 + '-01-01 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
                this.VariablesDocumentoInstancia['fecha_2015_06_10'] = finAnio.format('YYYY-MM-DD');
                //inicio año ante anterior
                this.VariablesDocumentoInstancia['fecha_2012_01_01'] = iniciAnioAntAnt.format('YYYY-MM-DD');
                //fin año ante anterior
                this.VariablesDocumentoInstancia['fecha_2013_12_31'] = finAnioAntAnt.format('YYYY-MM-DD');;
                //Inicio año anterior
                this.VariablesDocumentoInstancia['fecha_2014_01_01'] = iniciAnioAnt.format('YYYY-MM-DD');
                //Fin año anterior
                this.VariablesDocumentoInstancia['fecha_2014_12_31'] = finAnioAnt.format('YYYY-MM-DD');;
                //Inicio año actual
                this.VariablesDocumentoInstancia['fecha_2015_01_01'] = iniciAnio.format('YYYY-MM-DD');



                // etiquetas

                this.VariablesDocumentoInstancia['valorDefaultTheMentionOfTheSecuritiesAreRegisteredInTheRNV'] = '';
                this.VariablesDocumentoInstancia['valorDefaultIssuanceUnderArt13OfTheCUELegend'] = '';
                this.VariablesDocumentoInstancia['valorDefaultLegendArticle86OfTheLMV'] = '';
                this.VariablesDocumentoInstancia['valorDefaultLegendDocumentAvailableWithTheUnderwriter'] = '';
                this.VariablesDocumentoInstancia['valorDefaultNumerationOfPossibleAcquirers'] = '';


                if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_TheMentionOfTheSecuritiesAreRegisteredInTheRNV'] !== undefined) {
                    if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_TheMentionOfTheSecuritiesAreRegisteredInTheRNV'].Etiquetas['es'] !== undefined &&
                        this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_TheMentionOfTheSecuritiesAreRegisteredInTheRNV'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'] !== undefined) {
                        this.VariablesDocumentoInstancia['valorDefaultTheMentionOfTheSecuritiesAreRegisteredInTheRNV'] = this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_TheMentionOfTheSecuritiesAreRegisteredInTheRNV'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'].Valor;
                    }
                }


                if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_IssuanceUnderArt13OfTheCUELegend'] !== undefined) {
                    if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_IssuanceUnderArt13OfTheCUELegend'].Etiquetas['es'] !== undefined &&
                        this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_IssuanceUnderArt13OfTheCUELegend'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'] !== undefined) {
                        this.VariablesDocumentoInstancia['valorDefaultIssuanceUnderArt13OfTheCUELegend'] = this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_IssuanceUnderArt13OfTheCUELegend'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'].Valor;
                    }
                }

                if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendDocumentAvailableWithTheUnderwriter'] !== undefined) {
                    if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendDocumentAvailableWithTheUnderwriter'].Etiquetas['es'] !== undefined &&
                        this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendDocumentAvailableWithTheUnderwriter'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'] !== undefined) {
                        this.VariablesDocumentoInstancia['valorDefaultLegendDocumentAvailableWithTheUnderwriter'] = this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendDocumentAvailableWithTheUnderwriter'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'].Valor;
                    }
                }

                if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendArticle86OfTheLMV'] !== undefined) {
                    if (this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendArticle86OfTheLMV'].Etiquetas['es'] !== undefined &&
                        this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendArticle86OfTheLMV'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'] !== undefined) {
                        this.VariablesDocumentoInstancia['valorDefaultLegendArticle86OfTheLMV'] = this.DocumentoInstancia.Taxonomia.ConceptosPorId['ar_pros_LegendArticle86OfTheLMV'].Etiquetas['es']['http://www.xbrl.org/2003/role/documentation'].Valor;
                    }
                }

                this.evaluaelementosAplicablesProspecto(this.DocumentoInstancia, this, this.VariablesDocumentoInstancia);

            }
            this.asignarHechosSoloLectura(this.VariablesDocumentoInstancia);
            return resultado;
        }


		/**
        * Elimina de cada rol los hechos que no aplican según las características del documento de instancia
        */
        eliminarHechosSinUso(abaxServicio: services.AbaxXBRLServices): void {
            super.eliminarHechosSinUsoPros(abaxServicio, this.DocumentoInstancia, this.VariablesDocumentoInstancia);
		}

		/**
         * Obtiene la etiqueta de la parte de referencia.
         *
         * @param nombreParte el nombre que se requiere obtener la etiqueta.
         * @param lenguaje es el código del lenguaje que se desea presentar la etiqueta
         * @return la etiqueta de la parte de la referencia en el lenguaje especificado.
         */
        obtenerEtiquetaParteReferencia(nombreParte: string, lenguaje: string): string {

            var etiquetaParte = this.EtiquetasParteReferencia[lenguaje][nombreParte];

            if (etiquetaParte == null) {
                etiquetaParte = this.EtiquetasParteReferencia[this.IDIOMA_DEFAULT()][nombreParte];
            }

            return etiquetaParte;
        }

		/**
        * Crea todas las etiquetas de las partes de una referencia por taxonomia.
        */
        generarEtiquetasPartesReferencia(): void {
            this.generarEtiquetasPartesReferenciaArPros(this.EtiquetasParteReferencia);

        }

        /**
         * Obtiene un mapa cuyas llaves son el identificador de la variable del documento instancia y como valor asociado el valor determinado para la variable del documento.
         *
         * @return un mapa cuyas llaves son el identificador de la variable del documento instancia y como valor asociado el valor determinado para la variable del documento.
         */
        obtenerVariablesDocumentoInstancia(): { [id: string]: string } {
            return this.VariablesDocumentoInstancia;
        }

        /**
         * Obtiene el valor de una variable por medio de su identificador.
         *
         * @param id el identificador de la variable a consultar.
         * @return el valor asociado a la variable que corresponde al identificador proporcionado. null si no existe una variable con dicho identificador.
         */
        obtenerVariablePorId(id: string): string {
            var variable: string = null;

            if (this.VariablesDocumentoInstancia[id] && this.VariablesDocumentoInstancia[id] != null) {
                variable = this.VariablesDocumentoInstancia[id];
            }

            return variable;
        }

        /**
         * Obtiene una ruta relativa a la raíz de la aplicación web en donde se encuentra la plantilla que deberá ser utilizada para el formato de captura de un rol de un documento instancia XBRL.
         *
         * @param rolURI el URI del rol a consultar.
         * @return la ubicación relativa desde la raíz de la aplicación donde se localiza la plantilla. null en caso de no existir una plantilla para dicho rol.
         */
        obtenerUbicacionPlantillaDeRol(rolURI: string): string {
            if (!this.IncapazDeterminarParametrosConfiguracion) {
                var rutaPlantillas = 'ts/templates/taxonomias/ra_prospecto/HBIS3/';
                var extensionPlantillas = '.html';
                return rutaPlantillas + rolURI.replace(':', '_').replace(/\//g, '_') + extensionPlantillas;
            } else {
                return 'ts/templates/taxonomias/plantilla_generica.html'
            }
        }

        /**
         * Obtiene una ruta relativa a la raíz de la aplicación web en donde se encuentra la definición de la plantilla que deberá ser utilizada para el formato de captura de un rol de un documento instancia XBRL.
         *
         * @param rolURI el URI del rol a consultar.
         * @return la ubicación relativa desde la raíz de la aplicación donde se localiza la definición de la  plantilla. null en caso de no existir una definició nde la plantilla para dicho rol.
         */
        obtenerUbicacionDefinicionDeRol(rolURI: string): string {
            if (!this.IncapazDeterminarParametrosConfiguracion) {
                var rutaDefiniciones = 'ts/templates/taxonomias/ra_prospecto/HBIS3/';
                var extensionDefiniciones = '.js?version=' + root.AbaxXBRLConstantesRoot.VERSION_APP.version;
                return rutaDefiniciones + rolURI.replace(':', '_').replace(/\//g, '_') + extensionDefiniciones;
            } else {
                return 'ts/templates/taxonomias/plantilla_generica.html'
            }
        }

        /**
       * Manejador para el llenado del tipo de instrmento.
       * @param dependencias Dependencias.
       * @return Opciones del combo.
       */
        public manejadorTipoInstrumento(dependencias: { [nombreParametro: string]: string }): Array<model.SelectItem> {

            var opcionesTipoInstrumento: { [clave: string]: string };
            /*
            if (dependencias == undefined || dependencias['tipoReporte'] == undefined) {
                opcionesTipoInstrumento = {}
            } else if (dependencias['tipoReporte'] == "pe" || dependencias['tipoReporte'] == "su") {
                opcionesTipoInstrumento = {
                    "Certificados bursátiles fiduciarios inmobiliarios": "Certificados bursátiles fiduciarios inmobiliarios",
                    "Certificados bursátiles fiduciarios de largo plazo": "Certificados bursátiles fiduciarios de largo plazo",
                    "Certificados bursátiles fiduciarios de corto plazo": "Certificados bursátiles fiduciarios de corto plazo"
                };
            } else {
                opcionesTipoInstrumento = {
                    "Certificados bursátiles fiduciarios inmobiliarios": "Certificados bursátiles fiduciarios inmobiliarios",
                    "Certificados bursátiles fiduciarios de largo plazo": "Certificados bursátiles fiduciarios de largo plazo",
                    "Certificados bursátiles fiduciarios de corto plazo": "Certificados bursátiles fiduciarios de corto plazo",
                    "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de largo plazo": "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de largo plazo",
                    "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de corto plazo": "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de corto plazo",
                    "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de largo plazo,Certificados bursátiles fiduciarios de corto plazo": "Certificados bursátiles fiduciarios inmobiliarios,Certificados bursátiles fiduciarios de largo plazo,Certificados bursátiles fiduciarios de corto plazo"
                };
            }
            */
            opcionesTipoInstrumento = {
                "Certificados bursátiles fiduciarios inmobiliarios": "Certificados bursátiles fiduciarios inmobiliarios",
                "Certificados bursátiles fiduciarios de largo plazo": "Certificados bursátiles fiduciarios de largo plazo",
                "Certificados bursátiles fiduciarios de corto plazo": "Certificados bursátiles fiduciarios de corto plazo"
            };

            var listaOpciones = new Array<model.SelectItem>();

            for (var etiqueta in opcionesTipoInstrumento) {
                var opcion = new model.SelectItem();
                opcion.Etiqueta = etiqueta;
                opcion.Valor = opcionesTipoInstrumento[etiqueta];
                listaOpciones.push(opcion);
            }

            return listaOpciones;
        }
        /**
         *
         * Obtiene los conceptos a colorear en la plantilla denotas.
         * @returns Diccionario con los conceptos que deben ser pintados.
         */
        public obtenColoresConceptosPlantillaNotas(): { [idConcepto: string]: string } {
            var documentoInstancia = plugins.AngularJQueryBridge.getInstance().obtenerAbaxService().getDocumentoInstancia();
            return super.obtenColoresConceptosNotas(documentoInstancia);
        }
        /**
         * Inicializa las acciones personalizadas de la taxonomía.
         */
        private inicializaAccionesTaxonomia(): void {

            var $self = this;
            $self.accionesPlantilla["descargarPlantillaPersonasResponsables"] = function () { $self.descargarPlantillaPersonasResponsables(); };
            $self.accionesPlantilla["descargarPlantillaFirmaArticulo13"] = function () { $self.descargarPlantillaFirmaArticulo13(); };

        }

        /**
        * Manejador para el llenado del tipo de instrmento.
        * @param parametros Parametros.
        * @return Opciones que serán mostradas por el usuario.
        */
        public manejadorOpcionesSeleccionadas(parametros: { [nombreParametro: string]: any }): Array<model.SelectItem> {

            var opcionesFinales = new Array<model.SelectItem>();

            if (parametros['tipoReporte'] == "pe" || parametros['tipoReporte'] == "su") {
                opcionesFinales.push(parametros['opcionActualSeleccionada']);
            } else {
                opcionesFinales = parametros['opcionesSeleccionadas'];
                opcionesFinales.push(parametros['opcionActualSeleccionada']);
            }

            return opcionesFinales;
        }

        /**
         * Constructor por defecto de la clase http___www_cnbv_gob_mx_2016_08_22_ar_prospectus_pros_HBIS3_entry_point_2016_08_22
         */
        constructor() {
            super();
            this.DefinicionesElementos = {
                ContextosPlantillaPorId: {},
                UnidadesPlantillaPorId: {},
                HechosPlantillaPorId: {},
				ListadoDeFormulas: {}
            };
            this.VariablesDocumentoInstancia = {};
            this.EtiquetasParteReferencia = {};
            this.DocumentoInstancia = null;
            this.ParametrosConfiguracion = null;
            this.IncapazDeterminarParametrosConfiguracion = false;
            this.DefinicionesParametrosConfiguracion = this.inicializarParametrosConfiguracionPros(true);
            this.DefinicionesParametrosConfiguracion['tipoInstrumentoDescripcion']
                .InformacionAdicional['accion'] = $.proxy(this.manejadorTipoInstrumento, this);
            this.DefinicionesParametrosConfiguracion['tipoInstrumentoDescripcion']
                .InformacionAdicional['onSelected'] = $.proxy(this.manejadorOpcionesSeleccionadas, this);
            this.inicializaAccionesTaxonomia();
        }
    }

}