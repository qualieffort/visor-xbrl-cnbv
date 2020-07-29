///<reference path="../../../modeloAbax.ts" /> 
///<reference path="../../../modeloPlantillaAbax.ts" /> 
///<reference path="../../../../scripts/typings/moment/moment.d.ts" />
module abaxXBRL.templates {

    /**
     * Implementación del Objeto de Plantilla de documento de instancia XBRL para la taxonomía de http://www.supersociedades.gov.co/sds/fr/ifrs/2015-03-04
     */
    export class http___www_supersociedades_gov_co_sds_fr_ifrs_2015_03_04 implements abaxXBRL.model.DefinicionDePlantillaXbrl {

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
        ParametrosConfiguracion: { [id: string]: string } = {};

        /** Muestra el diccioneadio de las etiquetas de las partes de una referencia por idioma. */
        EtiquetasParteReferencia: { [idioma: string]: { [nombreParte: string]: string } } = {};

        /** El idioma por defecto para las etiquetas */
        IDIOMA_DEFAULT(): string { return 'es'; }

        /** Lista de los periodos válidos en el documento */
        PeriodosValidos: Array<model.Periodo> = null;
        /** Lista de unidades válidas en el documento */
        UnidadesValidas: Array<model.Unidad> = null;
        /** Las llaves que identifican los diferentes grupos de periodos por fecha (instante o duración) */
        llavesPeriodo: Array<string>;
        /** Las entidades asociadas con el documento instancia */
        entidades: Array<model.EntidadPlantilla>;
        /** Información adicional asociada a la plantilla de taxonomía */
        informacionExtra: { [id: string]: any };
        obtenerDefinicionDeParametrosDeConfiguracion(): { [id: string]: abaxXBRL.model.DefinicionParametroConfiguracionPlantilla } {
            return this.DefinicionesParametrosConfiguracion;
        }

        agregarDefinicionElementos(definicion: abaxXBRL.model.DefinicionDeElementosPlantilla): void {
            $.extend(true, this.DefinicionesElementos.ContextosPlantillaPorId, definicion.ContextosPlantillaPorId);
            $.extend(true, this.DefinicionesElementos.UnidadesPlantillaPorId, definicion.UnidadesPlantillaPorId);
            $.extend(true, this.DefinicionesElementos.HechosPlantillaPorId, definicion.HechosPlantillaPorId);
        }

        obtenerDefinicionDeElementos(): abaxXBRL.model.DefinicionDeElementosPlantilla {
            return this.DefinicionesElementos;
        }

        determinarParametrosConfiguracion(): boolean {
            var resultado: boolean = true;
            this.ParametrosConfiguracion = {};
            
            var nit = this.ParametrosConfiguracion["nit"];
            var fechaCierre = this.ParametrosConfiguracion["fechaCierre"];
            var dateFechaCierre = moment(fechaCierre).utc();
            var moneda: string = this.ParametrosConfiguracion["moneda"];

            var hechosFechaCierre = this.DocumentoInstancia.HechosPorIdConcepto["sds_FechaDeCorte"];

            if (hechosFechaCierre && hechosFechaCierre != null && hechosFechaCierre.length && hechosFechaCierre.length == 1) {
                var hechoFechaCierre = this.DocumentoInstancia.HechosPorId[hechosFechaCierre[0]];
                this.ParametrosConfiguracion['fechaCierre'] = hechoFechaCierre.ValorHecho;

                var contexto = this.DocumentoInstancia.ContextosPorId[hechoFechaCierre.IdContexto];
                if (contexto && contexto != null) {
                    this.ParametrosConfiguracion['nit'] = contexto.Entidad.Id;
                    this.ParametrosConfiguracion['namespaceEmisora'] = contexto.Entidad.EsquemaId;
                } else {
                    resultado = false;
                }

                
                var moneda: string = null;
                for (var idUnidad in this.DocumentoInstancia.UnidadesPorId) {
                    if (this.DocumentoInstancia.UnidadesPorId[idUnidad]) {
                        var unidad = this.DocumentoInstancia.UnidadesPorId[idUnidad];
                        if (unidad.Tipo == abaxXBRL.model.Unidad.MEDIDA) {
                            if (unidad.Medidas && unidad.Medidas.length == 1 && unidad.Medidas[0].EspacioNombres == abaxXBRL.model.ConstantesComunes.ESPACIO_NOMBRES_MONEDAS) {
                                moneda = unidad.Medidas[0].EspacioNombres + ':' + unidad.Medidas[0].Nombre;
                                break;
                            }
                        }
                    }
                }
                if (moneda != null) {
                    this.ParametrosConfiguracion['moneda'] = moneda;
                } else {
                    resultado = false;
                }

            } else {
                resultado = false;
            }
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

            this.generarEtiquetasPartesReferencia();
        }

        /**
         * Genera las variables requeridas por el documento instancia.
         *
         * @return true si fue posible generar con éxito las variables. false en cualquier otro caso.
         */
        generarVariablesDocumentoInstancia(): boolean {

            var resultado: boolean = true;

            var nit = this.ParametrosConfiguracion["nit"];
            var fechaCierre = this.ParametrosConfiguracion["fechaCierre"];
            var dateFechaCierre = moment(fechaCierre).utc();
            var moneda: string = this.ParametrosConfiguracion["moneda"];
            var finAnioAnterior = moment((dateFechaCierre.year() - 1) + '-12-31 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
            var cierreAnioAnterior = moment(fechaCierre).utc().subtract("year", 1);
            var inicioAnio = moment((dateFechaCierre.year()) + '-01-01 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
            var inicioAnioAnterior = moment((dateFechaCierre.year()-1) + '-01-01 0:00 + 0000', abaxXBRL.model.ConstantesComunes.FORMATO_FECHA + ' HH:mm Z').utc();
            
            this.VariablesDocumentoInstancia['fecha_2014_01_01'] = inicioAnio.format('YYYY-MM-DD');
            this.VariablesDocumentoInstancia['fecha_2014_09_30'] = dateFechaCierre.format('YYYY-MM-DD');

            this.VariablesDocumentoInstancia['nombreEntidad'] = this.ParametrosConfiguracion["nit"];

            if (this.ParametrosConfiguracion['namespaceEmisora'] && this.ParametrosConfiguracion['namespaceEmisora'] != null) {
                this.VariablesDocumentoInstancia['esquemaEntidad'] = this.ParametrosConfiguracion['namespaceEmisora'];
            } else {
                this.VariablesDocumentoInstancia['esquemaEntidad'] = 'http://www.dian.gov.co/nit';
            }

            
			this.VariablesDocumentoInstancia['valorDefaultNoNumerico'] = '';
        
            this.VariablesDocumentoInstancia['medida_COP'] = moneda.replace('http://www.xbrl.org/2003/iso4217:', '');
            this.VariablesDocumentoInstancia['medida_COP_sin_contexto'] = moneda.replace(new RegExp("http:.*:"), ""); //Unidad de medida MX, elimina el contexto.

            this.VariablesDocumentoInstancia['medida_http___www_xbrl_org_2003_iso4217'] = 'http://www.xbrl.org/2003/iso4217';
            this.VariablesDocumentoInstancia['valorDefaultNumerico'] = '0';

            this.VariablesDocumentoInstancia['fecha_2013_12_31'] = finAnioAnterior.format('YYYY-MM-DD');
            this.VariablesDocumentoInstancia['fecha_2013_01_01'] = inicioAnioAnterior.format('YYYY-MM-DD');
            this.VariablesDocumentoInstancia['fecha_2013_09_30'] = cierreAnioAnterior.format('YYYY-MM-DD');

			this.VariablesDocumentoInstancia['medida_shares'] = 'shares';
            this.VariablesDocumentoInstancia['medida_http___www_xbrl_org_2003_instance'] = 'http://www.xbrl.org/2003/instance';


            return resultado;
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
                var rutaPlantillas = 'ts/templates/taxonomias/sds_ifrs-inicio-plenas-individuales-2015-03-04/';
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
                var rutaDefiniciones = 'ts/templates/taxonomias/sds_ifrs-inicio-plenas-individuales-2015-03-04/';
                var extensionDefiniciones = '.js';
                return rutaDefiniciones + rolURI.replace(':', '_').replace(/\//g, '_') + extensionDefiniciones;
            } else {
                return 'ts/templates/taxonomias/plantilla_generica.html'
            }
        }
        /**
        * Elimina de cada rol los hechos que no aplican según las características del documento de instancia
        */
        eliminarHechosSinUso(abaxServicio: services.AbaxXBRLServices): void {

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

            if (!this.EtiquetasParteReferencia["es"]) {
                this.EtiquetasParteReferencia["es"] = {}
                this.EtiquetasParteReferencia["es"]["Name"] = "Nombre";
                this.EtiquetasParteReferencia["es"]["IssueDate"] = "Fecha";
                this.EtiquetasParteReferencia["es"]["Section"] = "Sección";
                this.EtiquetasParteReferencia["es"]["URI"] = "Dirección";
                this.EtiquetasParteReferencia["es"]["URIDate"] = "Fecha de dirección ";
                this.EtiquetasParteReferencia["es"]["Paragraph"] = "Parrafo";
                this.EtiquetasParteReferencia["es"]["Number"] = "Numero";
                this.EtiquetasParteReferencia["es"]["Subparagraph"] = "Sub parrafo";
                this.EtiquetasParteReferencia["es"]["Clause"] = "Cláusula";

                this.EtiquetasParteReferencia["en"] = {}
                this.EtiquetasParteReferencia["en"]["Name"] = "Name";
                this.EtiquetasParteReferencia["en"]["IssueDate"] = "Issue Date";
                this.EtiquetasParteReferencia["en"]["Section"] = "Section";
                this.EtiquetasParteReferencia["en"]["URI"] = "URI";
                this.EtiquetasParteReferencia["en"]["URIDate"] = "URI Date";
                this.EtiquetasParteReferencia["en"]["Paragraph"] = "Paragraph";
                this.EtiquetasParteReferencia["en"]["Number"] = "Number";
                this.EtiquetasParteReferencia["en"]["Subparagraph"] = "Subparagraph";
                this.EtiquetasParteReferencia["en"]["Clause"] = "Clause";
            }
        }
        /**
         * Constructor por defecto de la clase http___superwas_supersociedades_gov_co_sirfin_xbrl_2015_03_04_sds_ifrs_inicio_plenas_individuales_2015_03_04_xsd
         */
        constructor() {
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
            this.DefinicionesParametrosConfiguracion = {
                'nit': {
                    Etiqueta: 'NIT',
                    Id: 'nit',
                    Tipo: abaxXBRL.model.TipoDatoParametroConfiguracion.Cadena,
                    InformacionAdicional: {

                    }
                },
                'fechaCierre': {
                    Etiqueta: 'Fecha de Corte',
                    Id: 'fechaCierre',
                    Tipo: abaxXBRL.model.TipoDatoParametroConfiguracion.Fecha,
                    InformacionAdicional: {
                        'formatYear': 'yyyy',
                        'formato': 'yyyy-MM-dd',
                        'datepickerMode': "'day'",
                        'minMode': 'day',
                        'currentText': 'Hoy',
                        'clearText': 'Limpiar'
                    }
                }
                ,
                'moneda': {
                    Etiqueta: 'Moneda',
                    Id: 'moneda',
                    Tipo: abaxXBRL.model.TipoDatoParametroConfiguracion.Lista,
                    InformacionAdicional: {
                        'tipoLista': 'local',
                        'valores': {
                            'http://www.xbrl.org/2003/iso4217:COP': 'COP'
                            
                        }
                    }
                }
            };
        }
    }

}