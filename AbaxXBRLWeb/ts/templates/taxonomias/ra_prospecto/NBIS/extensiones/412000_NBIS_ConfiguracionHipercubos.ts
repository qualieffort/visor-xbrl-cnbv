/**
 * Definici�n JSON con la configuraci�n base de plantillas de contextos y dimensiones para el manejo de los hipercubos del rol #rolUri.
 * 
 * @author AbaxXBRL Template Generator
 * @version 1.0
 */
module abaxXBRL.hipercubos.config {

export var http___www_cnbv_gob_mx_2016_08_22_ar_prospectus_roles_412000_NBIS_ar_pros_SpecificationOfTheCharacteristicsOfOutstandingSecuritiesTable = {
  "FiltroCargaInicial": {
    "IdConcepto": [
      "ar_pros_Class",
      "ar_pros_EquitySerie",
      "ar_pros_SerieType",
      "ar_pros_SerieNumberOfStocks",
      "ar_pros_SerieStockExhangesWhereTheyAreRegistered",
      "ar_pros_SerieTickerFromTheSourceMarket",
      "ar_pros_SerieTypeOfOperation",
      "ar_pros_SerieObservations"
    ],
    "Periodo": [
      {
        "VariableFechaInstante": "fecha_2014_12_31",
        "Tipo": 1
      }
    ],
    "ClaveEntidad": [],
    "ConjuntosParcialesDimensiones": [
      [
        {
          "Explicita": false,
          "QNameDimension": "http://www.cnbv.gob.mx/2016-08-22/ar_prospectus:SeriesTypedAxis"
        }
      ]
    ]
  },
  "TemplatesDimensiones": {
    "ar_pros_SeriesTypedAxis": {
      "PrefijoValor": "<ar_pros:SerieDomain xmlns:ar_pros=\"http://www.cnbv.gob.mx/2016-08-22/ar_prospectus\">",
      "SubfijoValor": "</ar_pros:SerieDomain>",
      "EtiquetaNuevoElemento": "serie",
      "Explicita": false,
      "IdDimension": "ar_pros_SeriesTypedAxis",
      "QNameDimension": "http://www.cnbv.gob.mx/2016-08-22/ar_prospectus:SeriesTypedAxis"
    }
  },
  "MiembrosDimensiones": {},
  "GruposDimensionesMiembro": {
    "DEFAULT": {}
  },
  "PlantillasContextos": {
    "DEFAULT": {
      "Periodo": {
        "VariableFechaInstante": "fecha_2014_12_31",
        "Tipo": 1
      },
      "NombreGrupoDimensionesIniciales": "DEFAULT",
      "ContieneInformacionDimensional": true
    }
  },
  "Unidades": {
      "MXN": {
          "Id": "MXN",
          "Tipo": 1,
          "Medidas": [
              {
                  "Nombre": "medida_MXN",
                  "EspacioNombres": "medida_http___www_xbrl_org_2003_iso4217",
                  "Etiqueta": "MXN"
              }
          ]
      },
      "PURE": {
          "Id": "PURE",
          "Tipo": 1,
          "Medidas": [
              {
                  "Nombre": "medida_pure",
                  "EspacioNombres": "medida_http___www_xbrl_org_2003_instance"
              }
          ],
          "MedidasDenominador": [],
          "MedidasNumerador": []
      }
  }
};

}