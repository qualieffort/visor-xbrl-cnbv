///<reference path="../../../../modeloAbax.ts" />
///<reference path="../../../../modeloPlantillaAbax.ts" />
module abaxXBRL.templates {

    /**
     * Implementación de una clase con la definición de los elementos utilizados por la plantilla para presentar las definiciones del rol http://bmv.com.mx/role/ifrs/ccd/rol_full_ifrs_mx_2016-08-22-815101
     * 
     * @author AbaxXBRL Template Generator
     * @version 1.0
     */
    export class http___bmv_com_mx_role_ifrs_ccd_rol_full_ifrs_mx_2016_08_22_815101 implements abaxXBRL.model.DefinicionDeElementosPlantilla {

        /** La definición de los contextos utilizados por la plantilla */
        ContextosPlantillaPorId: { [idContextoPlantilla: string]: abaxXBRL.model.ContextoPlantilla };

        /** La definición de las unidades utilizadas por la plantilla */
        UnidadesPlantillaPorId: { [idUnidadPlantilla: string]: abaxXBRL.model.UnidadPlantilla };

        /** La definición de los hechos utilizados por la plantilla */
        HechosPlantillaPorId: { [idHechoPlantilla: string]: abaxXBRL.model.HechoPlantilla };

		/** El listado de fórmulas que se utilizan en un rol */
        ListadoDeFormulas: { [idFormula: string]: abaxXBRL.model.DefinicionFormula };

        /**
         * Constructor por defecto de la clase http___bmv_com_mx_role_ifrs_ccd_rol_full_ifrs_mx_2016_08_22_815101
         */
        constructor() {

            this.ListadoDeFormulas = {

                'VA_AnexoAA_VS_800100': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'VA_AnexoAA_VS_800100',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: 'bignumber(TotalFunding) + bignumber(TotalDebtInSecurities) + bignumber(TotalUnpaidAccruedInterest) + bignumber(TotalCreditsLoansOrNotRelevantFunding) '+
                                    '=='+
                                    'bignumber(BankLoansCurrent) + bignumber(StockMarketLoansCurrent) + bignumber(OtherCurrentPayables) + bignumber(BankLoansNonCurrent) + bignumber(StockMarketLoansNonCurrent) + bignumber(OtherNoncurrentPayables)',
                        MensajeExito: 'El importe de Créditos Bancarios a corto plazo + Créditos Bursátiles a corto plazo + Otras cuentas por pagar a corto plazo + Créditos Bancarios a largo plazo + Créditos Bursátiles a largo plazo + Otras cuentas por pagar a largo plazo del rol [800100] ' +
                        'corresponde a la suma de: Total de financiamientos + Total de deuda bursátil + Total de intereses devengados no pagados + Total de créditos, préstamos o financiamientos no relevantes del rol [815101]',
                        MensajeError: 'El importe de Créditos Bancarios a corto plazo + Créditos Bursátiles a corto plazo + Otras cuentas por pagar a corto plazo + Créditos Bancarios a largo plazo + Créditos Bursátiles a largo plazo + Otras cuentas por pagar a largo plazo del rol [800100] ' +
                                        'deber corresponder a la suma de: Total de financiamientos + Total de deuda bursátil + Total de intereses devengados no pagados + Total de créditos, préstamos o financiamientos no relevantes del rol [815101]',
                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'TotalFunding': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalFunding',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalFunding',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalDebtInSecurities': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalDebtInSecurities',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalDebtInSecurities',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalUnpaidAccruedInterest': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalUnpaidAccruedInterest',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalUnpaidAccruedInterest',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalCreditsLoansOrNotRelevantFunding': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalCreditsLoansOrNotRelevantFunding',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalCreditsLoansOrNotRelevantFunding',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'BankLoansCurrent': new model.DefinicionVariableFormula().deserialize({
                                Id: 'BankLoansCurrent',
                                IdConcepto: 'mx_ccd_BankLoansCurrent',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'StockMarketLoansCurrent': new model.DefinicionVariableFormula().deserialize({
                                Id: 'StockMarketLoansCurrent',
                                IdConcepto: 'mx_ccd_StockMarketLoansCurrent',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'OtherCurrentPayables': new model.DefinicionVariableFormula().deserialize({
                                Id: 'OtherCurrentPayables',
                                IdConcepto: 'ifrs-full_OtherCurrentPayables',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'BankLoansNonCurrent': new model.DefinicionVariableFormula().deserialize({
                                Id: 'BankLoansNonCurrent',
                                IdConcepto: 'mx_ccd_BankLoansNonCurrent',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'StockMarketLoansNonCurrent': new model.DefinicionVariableFormula().deserialize({
                                Id: 'StockMarketLoansNonCurrent',
                                IdConcepto: 'mx_ccd_StockMarketLoansNonCurrent',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'OtherNoncurrentPayables': new model.DefinicionVariableFormula().deserialize({
                                Id: 'OtherNoncurrentPayables',
                                IdConcepto: 'ifrs-full_OtherNoncurrentPayables',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                            
                        }
                    }),
                'VA_IndiceDeCoberturaDelServicioDeLaDeuda': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'VA_IndiceDeCoberturaDelServicioDeLaDeuda',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion:  '(bignumber(PlannedAmortizationOfPrincipalOfFinancing)) != 0?('+
                                    'bignumber(variable1) == round(' +
                                    '((bignumber(LiquidAssets) + bignumber(EstimatedOperatingIncome) + bignumber(RevolvingCreditLines) + bignumber(CapitalAmortizationOfTheCreditPortfolio) - bignumber(Distributions)) /' +
                                    '(bignumber(PlannedAmortizationOfPrincipalOfFinancing)))' +
                                    ' * 100 ) / 100):0==0',
                        MensajeExito: 'El valor de {variable1} es igual a la operación  (Activos Líquidos + Utilidad Operativa Estimada + Líneas de Crédito Revolventes + Amortización de capital de cartera de crédito - Distribuciones)  /  ( Amortizaciones programadas de principal de financiamientos)',
                        MensajeError: 'El valor de {variable1} deber ser igual a la operación  (Activos Líquidos + Utilidad Operativa Estimada + Líneas de Crédito Revolventes + Amortización de capital de cartera de crédito - Distribuciones)  /  ( Amortizaciones programadas de principal de financiamientos)',
                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs_mx-cor_20160822_CoverageRateDebtService',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'LiquidAssets': new model.DefinicionVariableFormula().deserialize({
                                Id: 'LiquidAssets',
                                IdConcepto: 'ifrs_mx-cor_20160822_LiquidAssets',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'EstimatedOperatingIncome': new model.DefinicionVariableFormula().deserialize({
                                Id: 'EstimatedOperatingIncome',
                                IdConcepto: 'ifrs_mx-cor_20160822_EstimatedOperatingIncome',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'RevolvingCreditLines': new model.DefinicionVariableFormula().deserialize({
                                Id: 'RevolvingCreditLines',
                                IdConcepto: 'ifrs_mx-cor_20160822_RevolvingCreditLines',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'CapitalAmortizationOfTheCreditPortfolio': new model.DefinicionVariableFormula().deserialize({
                                Id: 'CapitalAmortizationOfTheCreditPortfolio',
                                IdConcepto: 'ifrs_mx-cor_20160822_CapitalAmortizationOfTheCreditPortfolio',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'Distributions': new model.DefinicionVariableFormula().deserialize({
                                Id: 'Distributions',
                                IdConcepto: 'ifrs_mx-cor_20160822_Distributions',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'PlannedAmortizationOfPrincipalOfFinancing': new model.DefinicionVariableFormula().deserialize({
                                Id: 'PlannedAmortizationOfPrincipalOfFinancing',
                                IdConcepto: 'ifrs_mx-cor_20160822_PlannedAmortizationOfPrincipalOfFinancing',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })

                            
                            
                        }
                    }),

                'VA_NivelDeApalancamiento': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'VA_NivelDeApalancamiento',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: '(bignumber(EquitySecurities)) != 0?(' +
                        'bignumber(variable1) == round( (bignumber(Assets)  /  bignumber(EquitySecurities)) * 100) / 100 ' +
                        '):0==0',
                        MensajeExito: 'El valor de {variable1} es la razón de Activos totales entre Títulos de capital',
                        MensajeError: 'El valor de {variable1} debe ser la razón de Activos totales entre Títulos de capital',
                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs_mx-cor_20160822_LeverageLevel',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'Assets': new model.DefinicionVariableFormula().deserialize({
                                Id: 'Assets',
                                IdConcepto: 'ifrs-full_Assets',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'EquitySecurities': new model.DefinicionVariableFormula().deserialize({
                                Id: 'EquitySecurities',
                                IdConcepto: 'ifrs_mx-cor_20160822_EquitySecurities',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                        }
                    }),
                'VA_NivelEndeudamiento': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'VA_NivelEndeudamiento',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: '(bignumber(Assets)) != 0?(' +
                        'bignumber(variable1) == round((( bignumber(TotalFunding) + bignumber(TotalDebtInSecurities) + bignumber(TotalUnpaidAccruedInterest) + bignumber(TotalCreditsLoansOrNotRelevantFunding) ) '+
                        '/'+
                        'bignumber(Assets) )* 100) / 100 ' +
                        '):0==0',
                        MensajeExito: 'El valor de {variable1} corresponde a la operación  (Total de Financiamientos + Total de Deuda Bursátil + Total de Intereses Devengados no Pagados + Total de créditos, préstamos o financiamientos no relevantes) / Activos totales',
                        MensajeError: 'El valor de {variable1} debe corresponder a la operación  (Total de Financiamientos + Total de Deuda Bursátil + Total de Intereses Devengados no Pagados + Total de créditos, préstamos o financiamientos no relevantes) / Activos totales',
                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs_mx-cor_20160822_IndebtednessLevelAtTheEndOfTheQuarter',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalFunding': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalFunding',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalFunding',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalDebtInSecurities': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalDebtInSecurities',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalDebtInSecurities',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalUnpaidAccruedInterest': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalUnpaidAccruedInterest',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalUnpaidAccruedInterest',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'TotalCreditsLoansOrNotRelevantFunding': new model.DefinicionVariableFormula().deserialize({
                                Id: 'TotalCreditsLoansOrNotRelevantFunding',
                                IdConcepto: 'ifrs_mx-cor_20160822_TotalCreditsLoansOrNotRelevantFunding',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'Assets': new model.DefinicionVariableFormula().deserialize({
                                Id: 'Assets',
                                IdConcepto: 'ifrs-full_Assets',
                                PuedeCrearse: true,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                        }
                    })


            };

            this.ContextosPlantillaPorId = {
              "ct1": {
                "Id": "ct1",
                "Periodo": {
                  "Tipo": 1,
                  "FechaInstante": "#fecha_2015_09_30",
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

            this.UnidadesPlantillaPorId = {
  "pure": {
    "Id": "pure",
    "Tipo": 1,
    "Medidas": [
      {
        "Nombre": "#medida_pure",
        "EspacioNombres": "#medida_http___www_xbrl_org_2003_instance"
      }
    ],
    "MedidasDenominador": [],
    "MedidasNumerador": []
  },
  "mxn": {
    "Id": "mxn",
    "Tipo": 1,
    "Medidas": [
      {
        "Nombre": "#medida_MXN",
        "EspacioNombres": "#medida_http___www_xbrl_org_2003_iso4217"
      }
    ],
    "MedidasDenominador": [],
    "MedidasNumerador": []
  }
};
            
            this.HechosPlantillaPorId = {
  "ifrs_mx-cor_20160822_IndebtednessLevelAtTheEndOfTheQuarter_2785b06f-1525-4335-abe0-2a1b6b4fa119": {
    "Id": "ifrs_mx-cor_20160822_IndebtednessLevelAtTheEndOfTheQuarter_2785b06f-1525-4335-abe0-2a1b6b4fa119",
    "IdConcepto": "ifrs_mx-cor_20160822_IndebtednessLevelAtTheEndOfTheQuarter",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "pure",
    "Decimales": "1",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_TotalFunding_007d5bb7-422c-4f47-a4a4-d73934dee7d6": {
    "Id": "ifrs_mx-cor_20160822_TotalFunding_007d5bb7-422c-4f47-a4a4-d73934dee7d6",
    "IdConcepto": "ifrs_mx-cor_20160822_TotalFunding",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_TotalDebtInSecurities_2ee11baa-f584-4c37-ab14-d7acc21c48bd": {
    "Id": "ifrs_mx-cor_20160822_TotalDebtInSecurities_2ee11baa-f584-4c37-ab14-d7acc21c48bd",
    "IdConcepto": "ifrs_mx-cor_20160822_TotalDebtInSecurities",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_TotalUnpaidAccruedInterest_21bf852b-580a-4b21-ad53-308a7c8e49c3": {
    "Id": "ifrs_mx-cor_20160822_TotalUnpaidAccruedInterest_21bf852b-580a-4b21-ad53-308a7c8e49c3",
    "IdConcepto": "ifrs_mx-cor_20160822_TotalUnpaidAccruedInterest",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "A6c45b2fe-654a-4bb8-be6b-af393acb8cb5": {
      "Id": "A6c45b2fe-654a-4bb8-be6b-af393acb8cb5",
    "IdConcepto": "ifrs-full_Assets",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_TotalCreditsLoansOrNotRelevantFunding_d7fc8bd1-f225-4391-8f33-2aa5419c1a01": {
    "Id": "ifrs_mx-cor_20160822_TotalCreditsLoansOrNotRelevantFunding_d7fc8bd1-f225-4391-8f33-2aa5419c1a01",
    "IdConcepto": "ifrs_mx-cor_20160822_TotalCreditsLoansOrNotRelevantFunding",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_LeverageLevelText_8081f31d-6430-4ceb-9960-845fe428aaf9": {
    "Id": "ifrs_mx-cor_20160822_LeverageLevelText_8081f31d-6430-4ceb-9960-845fe428aaf9",
    "IdConcepto": "ifrs_mx-cor_20160822_LeverageLevelText",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": null,
    "ValorNumerador": null,
    "ValorDenominador": null,
    "Precision": null,
    "Decimales": null,
    "Valor": "#valorDefaultNoNumerico"
  },
  "ifrs_mx-cor_20160822_LeverageLevel_59649681-5a21-4bde-92c6-90bfcab37dbd": {
    "Id": "ifrs_mx-cor_20160822_LeverageLevel_59649681-5a21-4bde-92c6-90bfcab37dbd",
    "IdConcepto": "ifrs_mx-cor_20160822_LeverageLevel",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "pure",
    "Decimales": "2",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_EquitySecurities_e8a685dd-2a66-4b3c-bca8-4c0a8d8bf790": {
    "Id": "ifrs_mx-cor_20160822_EquitySecurities_e8a685dd-2a66-4b3c-bca8-4c0a8d8bf790",
    "IdConcepto": "ifrs_mx-cor_20160822_EquitySecurities",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_CoverageRateDebtServiceText_5810733e-f718-433b-b833-7d22df3ab786": {
    "Id": "ifrs_mx-cor_20160822_CoverageRateDebtServiceText_5810733e-f718-433b-b833-7d22df3ab786",
    "IdConcepto": "ifrs_mx-cor_20160822_CoverageRateDebtServiceText",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": null,
    "ValorNumerador": null,
    "ValorDenominador": null,
    "Precision": null,
    "Decimales": null,
    "Valor": "#valorDefaultNoNumerico"
  },
  "ifrs_mx-cor_20160822_CoverageRateDebtService_df592dcc-9d40-44bd-97ca-e898688415f6": {
    "Id": "ifrs_mx-cor_20160822_CoverageRateDebtService_df592dcc-9d40-44bd-97ca-e898688415f6",
    "IdConcepto": "ifrs_mx-cor_20160822_CoverageRateDebtService",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "pure",
    "Decimales": "2",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_LiquidAssets_98d628f2-73ca-487c-a5fa-be91b1cb2d14": {
    "Id": "ifrs_mx-cor_20160822_LiquidAssets_98d628f2-73ca-487c-a5fa-be91b1cb2d14",
    "IdConcepto": "ifrs_mx-cor_20160822_LiquidAssets",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_EstimatedOperatingIncome_797d88c0-5f35-4ee3-90ae-79bff5d1971b": {
    "Id": "ifrs_mx-cor_20160822_EstimatedOperatingIncome_797d88c0-5f35-4ee3-90ae-79bff5d1971b",
    "IdConcepto": "ifrs_mx-cor_20160822_EstimatedOperatingIncome",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_RevolvingCreditLines_b484d945-02e9-490f-b096-2e96451c5e66": {
    "Id": "ifrs_mx-cor_20160822_RevolvingCreditLines_b484d945-02e9-490f-b096-2e96451c5e66",
    "IdConcepto": "ifrs_mx-cor_20160822_RevolvingCreditLines",
    "IdContextoPlantilla": "ct1",
    "Hechos": [],
    "IdUnidadPlantilla": "mxn",
    "Decimales": "0",
    "Precision": null,
    "Valor": "#valorDefaultNumerico",
    "ValorNumerador": null,
    "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_CapitalAmortizationOfTheCreditPortfolio_b484d945-02e9-490f-b096-2e96451c5e66": {
      "Id": "ifrs_mx-cor_20160822_CapitalAmortizationOfTheCreditPortfolio_b484d945-02e9-490f-b096-2e96451c5e66",
      "IdConcepto": "ifrs_mx-cor_20160822_CapitalAmortizationOfTheCreditPortfolio",
      "IdContextoPlantilla": "ct1",
      "Hechos": [],
      "IdUnidadPlantilla": "mxn",
      "Decimales": "0",
      "Precision": null,
      "Valor": "#valorDefaultNumerico",
      "ValorNumerador": null,
      "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_Distributions_b484d945-02e9-490f-b096-2e96451c5e66": {
      "Id": "ifrs_mx-cor_20160822_Distributions_b484d945-02e9-490f-b096-2e96451c5e66",
      "IdConcepto": "ifrs_mx-cor_20160822_Distributions",
      "IdContextoPlantilla": "ct1",
      "Hechos": [],
      "IdUnidadPlantilla": "mxn",
      "Decimales": "0",
      "Precision": null,
      "Valor": "#valorDefaultNumerico",
      "ValorNumerador": null,
      "ValorDenominador": null
  },
  "ifrs_mx-cor_20160822_PlannedAmortizationOfPrincipalOfFinancing_b484d945-02e9-490f-b096-2e96451c5e66": {
      "Id": "ifrs_mx-cor_20160822_PlannedAmortizationOfPrincipalOfFinancing_b484d945-02e9-490f-b096-2e96451c5e66",
      "IdConcepto": "ifrs_mx-cor_20160822_PlannedAmortizationOfPrincipalOfFinancing",
      "IdContextoPlantilla": "ct1",
      "Hechos": [],
      "IdUnidadPlantilla": "mxn",
      "Decimales": "0",
      "Precision": null,
      "Valor": "#valorDefaultNumerico",
      "ValorNumerador": null,
      "ValorDenominador": null
  }
  ,
  "ifrs_mx-cor_20160822_CommentsOnAnnexAA_6c46e936-9aa4-42f1-bb6f-bc9ccc2a4398": {
    "Id": "ifrs_mx-cor_20160822_CommentsOnAnnexAA_6c46e936-9aa4-42f1-bb6f-bc9ccc2a4398",
    "IdConcepto": "ifrs_mx-cor_20160822_CommentsOnAnnexAA",
    "IdContextoPlantilla": "ct1",
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