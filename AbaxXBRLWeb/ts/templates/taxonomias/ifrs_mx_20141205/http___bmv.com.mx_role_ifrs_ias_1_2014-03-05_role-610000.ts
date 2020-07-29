///<reference path="../../../modeloAbax.ts" /> 
///<reference path="../../../modeloPlantillaAbax.ts" /> 
module abaxXBRL.templates {
    /**
     * Implementación de una clase con la definición de los elementos utilizados por la plantilla para presentar las definiciones del rol http://bmv.com.mx/role/ifrs/ias_1_2014-03-05_role-610000
     * @author AbaxXBRL Template Generator
     * @version 1.0
     */
    export class http___bmv_com_mx_role_ifrs_ias_1_2014_03_05_role_610000 implements abaxXBRL.model.DefinicionDeElementosPlantilla {

        /** La definición de los contextos utilizados por la plantilla */
        ContextosPlantillaPorId: { [idContextoPlantilla: string]: abaxXBRL.model.ContextoPlantilla };

        /** La definición de las unidades utilizadas por la plantilla */
        UnidadesPlantillaPorId: { [idUnidadPlantilla: string]: abaxXBRL.model.UnidadPlantilla };

        /** La definición de los hechos utilizados por la plantilla */
        HechosPlantillaPorId: { [idHechoPlantilla: string]: abaxXBRL.model.HechoPlantilla };

        /** La lista de fórmulas utilizadas en el rol */
        ListadoDeFormulas: { [idFormula: string]: abaxXBRL.model.DefinicionFormula };

        /**
         * Constructor por defecto de la clase http___bmv_com_mx_role_ifrs_ias_1_2014_03_05_role_610000
         */
        constructor() {
            this.ListadoDeFormulas = {
                //Se integran formulas de Value Assertion - ID : VA_110000_610000_01
                'formula20': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_Equity',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_1': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_1',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_ProfitLoss',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_2': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_2',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_OtherComprehensiveIncome',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_3': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_3',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_ComprehensiveIncome',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_4': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_4',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IssueOfEquity',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_5': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_5',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_DividendsPaid',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_6': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_6',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughOtherContributionsByOwners',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_7': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_7',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughOtherDistributionsToOwners',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_8': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_8',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughTransfersAndOtherChangesEquity',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_9': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_9',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughTreasuryShareTransactions',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_10': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_10',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughChangesInOwnershipInterestsInSubsidiariesThatDoNotResultInLossOfControl',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_11': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_11',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_IncreaseDecreaseThroughSharebasedPaymentTransactions',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_12': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_12',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_AmountRemovedFromReserveOfCashFlowHedgesAndIncludedInInitialCostOrOtherCarryingAmountOfNonfinancialAssetLiabilityOrFirmCommitmentForWhichFairValueHedgeAccountingIsApplied',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_13': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_13',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_AmountRemovedFromReserveOfChangeInValueOfTimeValueOfOptionsAndIncludedInInitialCostOrOtherCarryingAmountOfNonfinancialAssetLiabilityOrFirmCommitmentForWhichFairValueHedgeAccountingIsApplied',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_14': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_14',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_AmountRemovedFromReserveOfChangeInValueOfForwardElementsOfForwardContractsAndIncludedInInitialCostOrOtherCarryingAmountOfNonfinancialAssetLiabilityOrFirmCommitmentForWhichFairValueHedgeAccountingIsApplied',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_15': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_15',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_AmountRemovedFromReserveOfChangeInValueOfForeignCurrencyBasisSpreadsAndIncludedInInitialCostOrOtherCarryingAmountOfNonfinancialAssetLiabilityOrFirmCommitmentForWhichFairValueHedgeAccountingIsApplied',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                , 'formula20_16': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula20_16',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: '(variable2 == "false" and number(variable1) == 0) or (  variable2 == "true" and abs(number(variable1)) >= 0)',

                        MensajeExito: 'El hecho del {variable1} esta reportado para un documento consolidado de lo contrario no se reporta',
                        MensajeError: 'El hecho del {variable1} debe ser reportado para un documento consolidado de lo contrario no debe ser reportado',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_ChangesInEquity',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:NoncontrollingInterestsMember',
                                    IdItemMiembro: 'ifrs-full_NoncontrollingInterestsMember'
                                }]
                            })
                            , 'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_Consolidado',
                                PuedeCrearse: false,
                                PuedeEliminarse: false
                            })
                        }
                    })
                //Se integran formulas de Value Assertion - ID : VA_210000_01
                , 'formula21': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula21',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: 'abs(number(variable1)) > 0',
                        MensajeExito: 'El hecho reportado para el {variable1} tiene un valor diferente de 0.',
                        MensajeError: 'El hecho reportado para el {variable1} debería tener un valor diferente de 0.',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_EquityAndLiabilities',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            })
                        }
                    }
                    )
            //Se integran formulas de Value Assertion - ID : VA_210000_800100_01
                , 'formula22': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula22',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: 'number(variable1) == number(variable2)',
                        MensajeExito: 'El hecho reportado para el {variable1} es igual al total del hecho reportado para el concepto  Total de otros pasivos financieros a largo plazo.',
                        MensajeError: 'El hecho reportado para el {variable1} debe ser el total del hecho reportado para el concepto  Total de otros pasivos financieros a largo plazo.',

                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_OtherNoncurrentFinancialLiabilities',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_TotalDeOtrosPasivosFinancierosALargoPlazo',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),

                        }
                    })
            //Se integran formulas de Value Assertion - ID : VA_210000_800100_01
                , 'formula22_1': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula22_1',
                        TipoFormula: model.TipoFormula.ValueAssertion,

                        Expresion: 'number(variable1) == number(variable2)',
                        MensajeExito: 'El hecho reportado para el {variable1} es igual al total del hecho reportado para el concepto  Total de otros pasivos financieros a corto plazo.',
                        MensajeError: 'El hecho reportado para el {variable1} debe ser el total del hecho reportado para el concepto  Total de otros pasivos financieros a corto plazo.',
                        VariablesCoincidenPeriodo: true,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_OtherCurrentFinancialLiabilities',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),
                            'variable2': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable2',
                                IdConcepto: 'ifrs_mx-cor_20141205_TotalDeOtrosPasivosFinancierosACortoPlazo',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false
                            }),

                        }
                    })
                //Se integran formulas de <Value Assertion>  ID : VA_610000_01 : sum(//ifrs-full:Equity) gt 0 [dimensional]
                , 'formula27': new model.DefinicionFormula().deserialize(
                    {
                        Id: 'formula27',
                        TipoFormula: model.TipoFormula.ValueAssertion,
                        Expresion: 'abs(number(variable1)) > 0',
                        MensajeExito: 'El hecho reportado para el {variable1} tiene un valor mayor a 0.',
                        MensajeError: 'El hecho reportado para el {variable1} debe tener un valor mayor a 0.',

                        VariablesCoincidenPeriodo: false,
                        DefinicionVariables: {
                            'variable1': new model.DefinicionVariableFormula().deserialize({
                                Id: 'variable1',
                                IdConcepto: 'ifrs-full_Equity',
                                PuedeCrearse: false,
                                PuedeEliminarse: false,
                                ConteoHechos: false,
                                FiltrosDimension:
                                [{
                                    Explicita: true,
                                    QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:ComponentsOfEquityAxis',
                                    IdDimension: 'ifrs-full_ComponentsOfEquityAxis',
                                    QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:EquityMember',
                                    IdItemMiembro: 'ifrs-full_EquityMember'
                                }, {
                                        Explicita: true,
                                        QNameDimension: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full_RetrospectiveApplicationAndRetrospectiveRestatementAxis',
                                        IdDimension: 'ifrs-full_RetrospectiveApplicationAndRetrospectiveRestatementAxis',
                                        QNameItemMiembro: 'http://xbrl.ifrs.org/taxonomy/2014-03-05/ifrs-full:RestatedMember',
                                        IdItemMiembro: 'ifrs-full_RestatedMember'
                                    }]

                            })
                        }
                    })

            };
            this.ContextosPlantillaPorId = {};
            this.UnidadesPlantillaPorId = {};
            this.HechosPlantillaPorId = {};
        }
    }

}