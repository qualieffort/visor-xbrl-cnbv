///<reference path="../../../../modeloAbax.ts" /> 
///<reference path="../../../../modeloPlantillaAbax.ts" /> 
module abaxXBRL.templates {

    /**
     * Implementación de una clase con la definición de los elementos utilizados por la plantilla para presentar las definiciones del rol http://www.cnbv.gob.mx/2016-08-22/ar_prospectus/roles/432000-NBIS5
     * 
     * @author AbaxXBRL Template Generator
     * @version 1.0
     */
    export class http___www_cnbv_gob_mx_2016_08_22_ar_prospectus_roles_432000_NBIS5 implements abaxXBRL.model.DefinicionDeElementosPlantilla {

        /** La definición de los contextos utilizados por la plantilla */
        ContextosPlantillaPorId: { [idContextoPlantilla: string]: abaxXBRL.model.ContextoPlantilla };

        /** La definición de las unidades utilizadas por la plantilla */
        UnidadesPlantillaPorId: { [idUnidadPlantilla: string]: abaxXBRL.model.UnidadPlantilla };

        /** La definición de los hechos utilizados por la plantilla */
        HechosPlantillaPorId: { [idHechoPlantilla: string]: abaxXBRL.model.HechoPlantilla };

		/** El listado de fórmulas que se utilizan en un rol */
        ListadoDeFormulas: { [idFormula: string]: abaxXBRL.model.DefinicionFormula };

        /**
         * Constructor por defecto de la clase http___www_cnbv_gob_mx_2016_08_22_ar_prospectus_roles_432000_NBIS5
         */
        constructor() {

            this.ListadoDeFormulas = {


                'Obligatorio_Anexos_ar_pros_FinancialStatementsAuditedPdf': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'Obligatorio_Anexos_ar_pros_FinancialStatementsAuditedPdf',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: 'squeeze(size(variable1)) > 0',
                        MensajeExito: 'La longitud del texto contenido en el hecho del {variable1} es mayor a 0 caracteres',
                        MensajeError: 'La longitud del texto contenido en el hecho del {variable1} debería ser mayor a 0 caracteres',
                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ar_pros_FinancialStatementsAuditedPdf',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                        }
                    }
                ),
                'Obligatorio_Anexos_ar_pros_AdditionalInformationAnnexPdf': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'Obligatorio_Anexos_ar_pros_AdditionalInformationAnnexPdf',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: 'squeeze(size(variable1)) > 0',
                        MensajeExito: 'La longitud del texto contenido en el hecho del {variable1} es mayor a 0 caracteres',
                        MensajeError: 'La longitud del texto contenido en el hecho del {variable1} debería ser mayor a 0 caracteres',
                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ar_pros_AdditionalInformationAnnexPdf',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                        }
                    }
                )
            };

            this.ContextosPlantillaPorId = {
  "ctx_2014": {
    "Id": "ctx_2014",
    "Periodo": {
      "Tipo": 1,
      "FechaInstante": "#fecha_2014_12_31",
      "FechaInicio": "",
      "FechaFin": ""
    },
    "Entidad": {
      "Id": "#nombreEntidad",
      "EsquemaId": "#esquemaEntidad",
      "ContieneInformacionDimensional": false,
      "Segmento": null,
      "ValoresDimension": []
    },
    "ContieneInformacionDimensional": false,
    "Escenario": null,
    "ValoresDimension": []
  }
};

            this.UnidadesPlantillaPorId = {};
            
            this.HechosPlantillaPorId = {
  "ar_pros_ReferenceIncorporationAnnex_3093eb71-52b3-4a64-b8d1-8770125a514f": {
    "Id": "ar_pros_ReferenceIncorporationAnnex_3093eb71-52b3-4a64-b8d1-8770125a514f",
    "IdConcepto": "ar_pros_ReferenceIncorporationAnnex",
    "IdContextoPlantilla": "ctx_2014",
    "Hechos": [],
    "IdUnidadPlantilla": null,
    "ValorNumerador": null,
    "ValorDenominador": null,
    "Precision": null,
    "Decimales": null,
    "Valor": "#valorDefaultReferenceIncorporationAnnex"
  },
  "ar_pros_FinancialStatementsAuditedPdf_1415f257-65b3-4883-b81e-d124ef367680": {
    "Id": "ar_pros_FinancialStatementsAuditedPdf_1415f257-65b3-4883-b81e-d124ef367680",
    "IdConcepto": "ar_pros_FinancialStatementsAuditedPdf",
    "IdContextoPlantilla": "ctx_2014",
    "Hechos": [],
    "IdUnidadPlantilla": null,
    "ValorNumerador": null,
    "ValorDenominador": null,
    "Precision": null,
    "Decimales": null,
    "Valor": "#valorDefaultNoNumerico"
  },
  "ar_pros_AdditionalInformationAnnexPdf_3a34ed49-930c-4cff-823b-b90d2be78680": {
    "Id": "ar_pros_AdditionalInformationAnnexPdf_3a34ed49-930c-4cff-823b-b90d2be78680",
    "IdConcepto": "ar_pros_AdditionalInformationAnnexPdf",
    "IdContextoPlantilla": "ctx_2014",
    "Hechos": [],
    "IdUnidadPlantilla": null,
    "ValorNumerador": null,
    "ValorDenominador": null,
    "Precision": null,
    "Decimales": null,
    "Valor": "#valorDefaultNoNumerico"
  }
};
        }
    }

}