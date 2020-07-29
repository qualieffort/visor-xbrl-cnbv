using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using AbaxXBRLViewerWeb.Common.Util;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace AbaxXBRLViewerWeb.Common.Integration.Dao.Impl
{
    /// <summary>
    /// Implemntación del acceso a datos de los documentos instancia
    /// </summary>
    public class DocumentoInstanciaDao : BaseDAO, IDocumentoInstanciaDao
    {



        /// <summary>
        /// Consulta para la obtención de los datos de los últimos documentos resportados de cada.
        /// Emisora, taxonomía, trimestre y año.
        /// </summary>
        const string CONSULTA_ULTIMOS_DOCUMENTOS =
            "SELECT DOC.IdDocumentoInstancia," +
            "DOC.Titulo," +
            "TAX.IdTaxonomiaXbrl," +
            "DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') ClaveEmisora," +
            "DOC.Anio," +
            "DOC.Trimestre," +
            "DOC.FechaCreacion," +
            "ISNULL(TAX.IdPeriodicidadReporte,1) AS IdPeriodicidadReporte, " +
            "DOC.FechaReporte " +
            "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal) " +
              ",(SELECT ISNULL(IdEmpresa,-1) AS 'IdEmpresa', ISNULL(EspacioNombresPrincipal,'null') AS 'EspacioNombresPrincipal', ISNULL(Anio,-1) AS 'Anio', ISNULL(Trimestre,-1) AS 'Trimestre', MAX(FechaCreacion) AS 'FechaCreacion' " +
                "FROM DocumentoInstancia " +
                "GROUP BY IdEmpresa, EspacioNombresPrincipal, Anio, Trimestre ,NumFideicomiso " +
               ") TMAX " +
            "WHERE TMAX.IdEmpresa = ISNULL(DOC.IdEmpresa,-1) " +
              "AND TMAX.EspacioNombresPrincipal = ISNULL(DOC.EspacioNombresPrincipal,'null') " +
              "AND TMAX.Anio = ISNULL(DOC.Anio,-1) " +
              "AND TMAX.Trimestre = ISNULL(DOC.Trimestre,-1) " +
              "AND TMAX.FechaCreacion = DOC.FechaCreacion " +
              "AND TAX.MostrarVisorExterno = 1 " +
              "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) " +
            "ORDER BY DOC.FechaCreacion DESC";

        const string CONSULTA_DATA_TABLE_ULTIMOS_ENVIOS =
            "SELECT DOC.IdDocumentoInstancia," +
            "DOC.Titulo," +
            "TAX.IdTaxonomiaXbrl," +
            "TAX.Nombre AS Taxonomia," +
            "DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') ClaveEmisora," +
            "CASE  " +
                "WHEN TAX.IdPeriodicidadReporte = 2 THEN (CAST(YEAR(DOC.FechaReporte) AS varchar) + ' - ' + CAST(MONTH(DOC.FechaReporte) AS varchar)) " +
                "WHEN TAX.IdPeriodicidadReporte = 4 THEN (CONVERT(varchar, DOC.FechaReporte, 103)) " +
                "ELSE CAST(YEAR(DOC.FechaReporte) AS varchar) + isnull(' - ' + DOC.Trimestre,'')  " +
            "END " +
                "AS Periodo, " +
            "DOC.Anio," +
            "DOC.Trimestre," +
            "DOC.FechaCreacion," +
            "ISNULL(TAX.IdPeriodicidadReporte,1) AS IdPeriodicidadReporte, " +
            "DOC.FechaReporte, " +
            "'' as detalle, " +
            "TMAX.reg as noregistros, " +
            "TAX.MostrarVisorExterno as MostrarVisorExterno " +
            "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal) " +
              ",(SELECT ISNULL(IdEmpresa,-1) AS 'IdEmpresa', ISNULL(EspacioNombresPrincipal,'null') AS 'EspacioNombresPrincipal', ISNULL(Anio,-1) AS 'Anio', ISNULL(Trimestre,-1) AS 'Trimestre', MAX(FechaCreacion) AS 'FechaCreacion', count(*) AS 'reg'  " +
                "FROM DocumentoInstancia " +
                "GROUP BY IdEmpresa, EspacioNombresPrincipal, Anio, Trimestre ,NumFideicomiso " +
               ") TMAX " +
            "WHERE TMAX.IdEmpresa = ISNULL(DOC.IdEmpresa,-1) " +
              "AND TMAX.EspacioNombresPrincipal = ISNULL(DOC.EspacioNombresPrincipal,'null') " +
              "AND TMAX.Anio = ISNULL(DOC.Anio,-1) " +
              "AND TMAX.Trimestre = ISNULL(DOC.Trimestre,-1) " +
              "AND TMAX.FechaCreacion = DOC.FechaCreacion " +
              "AND TAX.MostrarVisorExterno = 1 " +
              "AND TAX.IdPeriodicidadReporte != 4 " +
            
              "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) ";

        const string CONSULTA_DATA_TABLE_HISTORICO_ENVIOS =
                    "SELECT DOC.IdDocumentoInstancia," +
                    "DOC.Titulo," +
                    "TAX.IdTaxonomiaXbrl," +
                    "TAX.Nombre AS Taxonomia," +
                    "DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') ClaveEmisora," +
                    "CASE  " +
                        "WHEN TAX.IdPeriodicidadReporte = 2 THEN (CAST(YEAR(DOC.FechaReporte) AS varchar) + ' - ' + CAST(MONTH(DOC.FechaReporte) AS varchar)) " +
                        "WHEN TAX.IdPeriodicidadReporte = 4 THEN (CONVERT(varchar, DOC.FechaReporte, 103)) " +
                        "ELSE CAST(YEAR(DOC.FechaReporte) AS varchar) + isnull(' - ' + DOC.Trimestre,'')  " +
                    "END " +
                        "AS Periodo, " +
                    "DOC.Anio," +
                    "DOC.Trimestre," +
                    "DOC.FechaCreacion," +
                    "ISNULL(TAX.IdPeriodicidadReporte,1) AS IdPeriodicidadReporte, " +
                    "DOC.FechaReporte, " +
                     "'' as detalle " +
                    "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal) " +
                      ",(SELECT ISNULL(DOC1.IdEmpresa,-1) AS 'IdEmpresa', ISNULL(DOC1.EspacioNombresPrincipal,'null') AS 'EspacioNombresPrincipal', ISNULL(DOC1.Anio,-1) AS 'Anio', ISNULL(DOC1.Trimestre,-1) AS 'Trimestre', " +
                       "DOC1.FechaCreacion AS 'FechaCreacion', " +
					   " CASE " +
                       "     WHEN TAX1.IdPeriodicidadReporte = 2 THEN(CAST(YEAR(DOC1.FechaReporte) AS varchar) + ' - ' + CAST(MONTH(DOC1.FechaReporte) AS varchar)) " +
                       "     WHEN TAX1.IdPeriodicidadReporte = 4 THEN (CONVERT(varchar, DOC1.FechaReporte, 103)) " +
                       "     ELSE CAST(YEAR(DOC1.FechaReporte) AS varchar) + isnull(' - ' + DOC1.Trimestre,'') " +
                       " END " +
                       " AS Periodo, " +
                       " DOC1.ClaveEmisora + isnull(' - ' + DOC1.NumFideicomiso, '') ClaveEmisora " +
                        "FROM DocumentoInstancia DOC1 " +
                        "LEFT OUTER JOIN TaxonomiaXbrl TAX1 ON LOWER(DOC1.EspacioNombresPrincipal) = LOWER(TAX1.EspacioNombresPrincipal) " +
                        "WHERE IdDocumentoInstancia =#id " + 
                       ") TMAX " +
                    "WHERE (TMAX.IdEmpresa = ISNULL(DOC.IdEmpresa,-1) " +
                      "AND TMAX.EspacioNombresPrincipal = ISNULL(DOC.EspacioNombresPrincipal,'null') " +
                      "AND TMAX.Anio = ISNULL(DOC.Anio,-1) " +
                      "AND TMAX.Trimestre = ISNULL(DOC.Trimestre,-1) " +
                      "AND DOC.FechaCreacion < TMAX.FechaCreacion " +
                      "AND TAX.MostrarVisorExterno = 1) " +
                      "AND TMAX.ClaveEmisora =DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') " +
                      "AND TMAX.Periodo = CASE " +
                        "WHEN TAX.IdPeriodicidadReporte = 2 THEN(CAST(YEAR(DOC.FechaReporte) AS varchar) + ' - ' + CAST(MONTH(DOC.FechaReporte) AS varchar)) " +
						"WHEN TAX.IdPeriodicidadReporte = 4 THEN (CONVERT(varchar, DOC.FechaReporte, 103)) " +
						"ELSE CAST(YEAR(DOC.FechaReporte) AS varchar) + isnull(' - ' + DOC.Trimestre,'') " +
                    "END " +
                      "ORDER BY DOC.FechaCreacion desc ";
              //"-- AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) ";

        const string CONSULTA_DATA_TABLE_TODOS_ENVIOS =
            "SELECT DOC.IdDocumentoInstancia," +
            "DOC.Titulo," +
            "TAX.IdTaxonomiaXbrl," +
            "TAX.Nombre AS Taxonomia," +
            "DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') ClaveEmisora," +
            "CONVERT(varchar, DOC.FechaReporte, 103) AS Periodo," +
            "DOC.Anio," +
            "DOC.Trimestre," +
            "DOC.FechaCreacion," +
            "ISNULL(TAX.IdPeriodicidadReporte,1) AS IdPeriodicidadReporte, " +
            "DOC.FechaReporte, " +
             "'' as detalle, " +
            "1 as noregistros, " +
            "TAX.MostrarVisorExterno as MostrarVisorExterno " + 
            "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal) " +
            "WHERE TAX.MostrarVisorExterno = 1 AND TAX.IdPeriodicidadReporte = 4 " +
            "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) ";
        const string CONSULTA_DATA_TABLE_ENVIOS_MENSUAL =
            "SELECT DOC.IdDocumentoInstancia, " +
            "DOC.Titulo, " +
            "TAX.IdTaxonomiaXbrl, " +
            "TAX.Nombre AS Taxonomia, " +
            "DOC.ClaveEmisora+isnull(' - ' + DOC.NumFideicomiso,'') ClaveEmisora, " +
            "CASE   " +
                "WHEN TAX.IdPeriodicidadReporte = 2 THEN (CAST(YEAR(DOC.FechaReporte) AS varchar) + ' - ' + CAST(MONTH(DOC.FechaReporte) AS varchar))  " +
                "WHEN TAX.IdPeriodicidadReporte = 4 THEN (CONVERT(varchar, DOC.FechaReporte, 103))  " +
                "ELSE CAST(YEAR(DOC.FechaReporte) AS varchar) + isnull(' - ' + DOC.Trimestre,'')   " +
            "END  " +
                "AS Periodo,  " +
            "DOC.Anio, " +
            "DOC.Trimestre, " +
            "DOC.FechaCreacion, " +
            "ISNULL(TAX.IdPeriodicidadReporte,1) AS IdPeriodicidadReporte,  " +
            "DOC.FechaReporte,  " +
            "'' as detalle, " +
            "TMAX.reg as noregistros " +
            "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal)  " +
              ",(SELECT ISNULL(IdEmpresa,-1) AS 'IdEmpresa', ISNULL(EspacioNombresPrincipal,'null') AS 'EspacioNombresPrincipal', ISNULL(Anio,-1) AS 'Anio', ISNULL(Trimestre,-1) AS 'Trimestre', FechaReporte as 'FechaReporte', MAX(FechaCreacion) AS 'FechaCreacion', count(*) AS 'reg'  " +
                "FROM DocumentoInstancia  " +
                "GROUP BY IdEmpresa, EspacioNombresPrincipal, Anio, Trimestre ,NumFideicomiso, FechaReporte  " +
               ") TMAX  " +
            "WHERE TMAX.IdEmpresa = ISNULL(DOC.IdEmpresa,-1)  " +
              "AND TMAX.EspacioNombresPrincipal = ISNULL(DOC.EspacioNombresPrincipal,'null')  " +
              "AND TMAX.Anio = ISNULL(DOC.Anio,-1)  " +
              "AND TMAX.Trimestre = ISNULL(DOC.Trimestre,-1)  " +
              "AND TMAX.FechaCreacion = DOC.FechaCreacion  " +
              "AND TMAX.FechaReporte = DOC.FechaReporte  " +
              "AND TAX.MostrarVisorExterno = 1 " +
              "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) ";

        const string CONSULTA_DATA_TABLE_TODOS = " select * from (" +
                     CONSULTA_DATA_TABLE_ULTIMOS_ENVIOS +
                     " UNION ALL " +
                     CONSULTA_DATA_TABLE_TODOS_ENVIOS +
                     ") T1 WHERE T1.MostrarVisorExterno = 1 ";

        /// <summary>
        /// Consulta con las periodicidades disponibles.
        /// </summary>
        const string CONSULTA_PERIODICIDADES = 
            "SELECT IdPeriodicidadReporte as Value, Nombre as Label " +
            "FROM PeriodicidadReporte " +
            "WHERE EXISTS (SELECT IdPeriodicidadReporte FROM TaxonomiaXbrl WHERE MostrarVisorExterno = 1)";
        /// <summary>
        /// Consult que para obtener el detalle de las taxonomías existentes.
        /// </summary>
        const string CONSULTA_TAXONOMIAS = 
            "SELECT DISTINCT IdTaxonomiaXbrl, Nombre,EspacioNombresPrincipal, IdPeriodicidadReporte " +
            "FROM TaxonomiaXbrl " +
            "WHERE MostrarVisorExterno = 1 ";
        /// <summary>
        /// Consulta para obtener los ejericios existentes.
        /// </summary>
        const string CONSULTA_EJERCICIOS =
            "SELECT DISTINCT Anio " +
            "FROM DocumentoInstancia " +
            "WHERE Anio is not null";
        /// <summary>
        /// Consulta para ontener los trimestres existentes.
        /// </summary>
        const string CONSULTA_TRIMESTRE =
            "SELECT DISTINCT Trimestre " +
            "FROM DocumentoInstancia " +
            "WHERE Trimestre > '0' " +
            "AND Trimestre < '5' " +
            "AND Trimestre is not null " +
            "ORDER BY Trimestre asc";

        public PaginacionSimpleDto<DocumentoInstanciaDto> ObtenerDocumentosInstanciaPorPaginacion(PaginacionSimpleDto<DocumentoInstanciaDto> paginacion)
        {

            var builder = CreateDbParametersBuilder();

            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, CONSULTA_ULTIMOS_DOCUMENTOS,
                delegate(IDataReader reader, int rowNum) { return CrearDocumentoInstancia(reader, rowNum); },
                builder.GetParameters());

            paginacion.ListaRegistros = documentosInstancia;
            paginacion.TotalRegistros = documentosInstancia.Count();

            return paginacion;
        }

        public ArchivoDocumentoInstanciaDto ObtenerArchivoDocumentosInstancia(long idDocumentoInstancia, long idTipoArchivo)
        {

            var builder = CreateDbParametersBuilder();
            var query = "SELECT DOC.* FROM ArchivoDocumentoInstancia DOC " +
                        "WHERE DOC.IdDocumentoInstancia=" + idDocumentoInstancia +
                        "and DOC.IdTipoArchivo=" + idTipoArchivo;

            var archivosDocumentoInstancia = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, query,
                delegate(IDataReader reader, int rowNum) { return CrearArchivoDocumentoInstancia(reader, rowNum); },
                builder.GetParameters());


            return (archivosDocumentoInstancia != null && archivosDocumentoInstancia.Count > 0) ? archivosDocumentoInstancia.First() : null;
        }

        /// <summary>
        /// Crea un objeto con la informacion de un registro del documento instancia
        /// </summary>
        /// <param name="reader">Informacion del registro de la bd</param>
        /// <param name="rowNum">Numero de registro que se esta consultando</param>
        /// <returns>Objeto con la informacion del documento instancia</returns>
        private DocumentoInstanciaDto CrearDocumentoInstancia(IDataReader reader, int rowNum)
        {
            var dto = new DocumentoInstanciaDto();
            
            if (DbUtil.FieldExists(reader, "IdDocumentoInstancia"))
            {
                dto.IdDocumentoInstancia = reader.GetInt64(reader.GetOrdinal("IdDocumentoInstancia"));
            }

            if (DbUtil.FieldExists(reader, "Titulo"))
            {
                dto.Titulo = reader.GetString(reader.GetOrdinal("Titulo"));
            }

            if (DbUtil.FieldExists(reader, "ParametrosConfiguracion"))
            {
                dto.ParametrosConfiguracion = reader.GetString(reader.GetOrdinal("ParametrosConfiguracion"));
            }

            if (DbUtil.FieldExists(reader, "EspacioNombresPrincipal"))
            {
                dto.EspacioNombresPrincipal = reader.GetString(reader.GetOrdinal("EspacioNombresPrincipal"));
            }
            if (DbUtil.FieldExists(reader, "IdTaxonomiaXbrl"))
            {
                dto.IdTaxonomiaXbrl = reader.GetInt64(reader.GetOrdinal("IdTaxonomiaXbrl"));
            }

            if (DbUtil.FieldExists(reader, "ClaveEmisora"))
            {
                dto.ClaveEmisora = reader.GetString(reader.GetOrdinal("ClaveEmisora"));
            }

            if (DbUtil.FieldExists(reader, "Anio"))
            {
                dto.Anio = reader.GetInt32(reader.GetOrdinal("Anio"));
            }

            if (DbUtil.FieldExists(reader, "Trimestre"))
            {
                dto.Trimestre = reader.GetString(reader.GetOrdinal("Trimestre"));
            }

            if (DbUtil.FieldExists(reader, "FechaCreacion"))
            {
                dto.FechaCreacion = reader.GetDateTime(reader.GetOrdinal("FechaCreacion"));
            }
            if (DbUtil.FieldExists(reader, "IdPeriodicidadReporte"))
            {
                dto.IdPeriodicidadReporte = reader.GetInt32(reader.GetOrdinal("IdPeriodicidadReporte"));
            }
            if (DbUtil.FieldExists(reader, "FechaReporte"))
            {
                dto.FechaReporte = reader.GetDateTime(reader.GetOrdinal("FechaReporte"));
            }
            return dto;
        }
        /// <summary>
        /// Crea un objeto con la informacion de un registro del documento instancia del DataTable
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="rowNum"></param>
        /// <returns></returns>
        private IList<String> CrearDocumentoDataTableInstancia(IDataReader reader, int rowNum)
        {
            var row = new List<String>();
            if (DbUtil.FieldExists(reader, "IdDocumentoInstancia"))
            {
                row.Add(reader.GetInt64(reader.GetOrdinal("IdDocumentoInstancia")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }

            if (DbUtil.FieldExists(reader, "detalle"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("detalle")).ToString());
            }
            
            

            if (DbUtil.FieldExists(reader, "FechaCreacion"))
            {
                row.Add(reader.GetDateTime(reader.GetOrdinal("FechaCreacion")).ToString("yyyy-MM-dd hh:mm:ss"));
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "ClaveEmisora"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("ClaveEmisora")));
            }
            else
            {
                row.Add(String.Empty);
            }

            if (DbUtil.FieldExists(reader, "Periodo"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("Periodo")));
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "Taxonomia"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("Taxonomia")));
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "Titulo"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("Titulo")));
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "IdTaxonomiaXbrl"))
            {
                row.Add(reader.GetInt64(reader.GetOrdinal("IdTaxonomiaXbrl")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }

            if (DbUtil.FieldExists(reader, "Anio"))
            {
                row.Add(reader.GetInt32(reader.GetOrdinal("Anio")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "Trimestre"))
            {
                row.Add(reader.GetString(reader.GetOrdinal("Trimestre")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "IdPeriodicidadReporte"))
            {
                row.Add(reader.GetInt32(reader.GetOrdinal("IdPeriodicidadReporte")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }
            if (DbUtil.FieldExists(reader, "FechaReporte"))
            {
                row.Add(reader.GetDateTime(reader.GetOrdinal("FechaReporte")).ToString("yyyy-MM-dd hh:mm:ss"));
            }
            else
            {
                row.Add(String.Empty);
            }

            if (DbUtil.FieldExists(reader, "noregistros"))
            {
                row.Add(reader.GetInt32(reader.GetOrdinal("noregistros")).ToString());
            }
            else
            {
                row.Add(String.Empty);
            }



            return row;
        }
        /// <summary>
        /// Crea un objeto con la informacion de un registro del documento instancia
        /// </summary>
        /// <param name="reader">Informacion del registro de la bd</param>
        /// <param name="rowNum">Numero de registro que se esta consultando</param>
        /// <returns>Objeto con la informacion del documento instancia</returns>
        private ArchivoDocumentoInstanciaDto CrearArchivoDocumentoInstancia(IDataReader reader, int rowNum)
        {
            var dto = new ArchivoDocumentoInstanciaDto();

            if (DbUtil.FieldExists(reader, "IdArchivoDocumentoInstancia"))
            {
                dto.IdArchivoDocumentoInstancia = reader.GetInt64(reader.GetOrdinal("IdArchivoDocumentoInstancia"));
            }

            if (DbUtil.FieldExists(reader, "IdDocumentoInstancia"))
            {
                dto.IdDocumentoInstancia = reader.GetInt64(reader.GetOrdinal("IdDocumentoInstancia"));
            }

            if (DbUtil.FieldExists(reader, "IdTipoArchivo"))
            {
                dto.IdTipoArchivo = reader.GetInt64(reader.GetOrdinal("IdTipoArchivo"));
            }

            if (DbUtil.FieldExists(reader, "Archivo"))
            {
                dto.Archivo = (byte[])reader[reader.GetOrdinal("Archivo")];
            }
            return dto;
        }

        /// <summary>
        /// Crea un objeto con la informacion obtenida de base de datos.
        /// </summary>
        /// <param name="reader">Informacion del registro de la bd</param>
        /// <param name="rowNum">Numero de registro que se esta consultando</param>
        /// <returns>Objeto con la informacion del documento instancia</returns>
        private OptionItemDto CrearElementoOpcion(IDataReader reader, int rowNum)
        {
            var dto = new OptionItemDto();

            if (DbUtil.FieldExists(reader, "Value"))
            {
                dto.Value = reader.GetInt32(reader.GetOrdinal("Value")).ToString();
            }

            if (DbUtil.FieldExists(reader, "Label"))
            {
                dto.Label = reader.GetString(reader.GetOrdinal("Label"));
            }
            return dto;
        }

        /// <summary>
        /// Crea un objeto con la informacion obtenida de la consulta.
        /// </summary>
        /// <param name="reader">Informacion del registro de la bd</param>
        /// <param name="rowNum">Numero de registro que se esta consultando</param>
        /// <returns>Objeto con la informacion del documento instancia</returns>
        private TaxonomiaXbrlDto CrearDetalleTaxonomiaXbrl(IDataReader reader, int rowNum)
        {
            var dto = new TaxonomiaXbrlDto();

            if (DbUtil.FieldExists(reader, "IdTaxonomiaXbrl"))
            {
                dto.IdTaxonomiaXbrl = reader.GetInt64(reader.GetOrdinal("IdTaxonomiaXbrl"));
            }

            if (DbUtil.FieldExists(reader, "Nombre"))
            {
                dto.Nombre = reader.GetString(reader.GetOrdinal("Nombre"));
            }

            if (DbUtil.FieldExists(reader, "EspacioNombresPrincipal"))
            {
                dto.EspacioNombresPrincipal = reader.GetString(reader.GetOrdinal("EspacioNombresPrincipal"));
            }

            if (DbUtil.FieldExists(reader, "IdPeriodicidadReporte"))
            {
                dto.IdPeriodicidadReporte = reader.GetInt32(reader.GetOrdinal("IdPeriodicidadReporte"));
            }
            return dto;
        }
        /// <summary>
        /// Crea un objeto  con la informacion de la consulta a Base de datos
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="rowNum"></param>
        /// <returns></returns>
        private IList<String> CrearDetalleEjercicios(IDataReader reader, int rowNum)
        {
            var dto = new List<String>();

            if (DbUtil.FieldExists(reader, "Anio"))
            {
                dto.Add(reader.GetInt32(reader.GetOrdinal("Anio")).ToString());
            }
            else
            {
                dto.Add(String.Empty);
            }
            return dto;
        }
        /// <summary>
        /// Crea un objeto  con la informacion de la consulta a Base de datos
        /// </summary>
        /// <param name="reader"></param>
        /// <param name="rowNum"></param>
        /// <returns></returns>
        private IList<String> CrearDetalleTrimestres(IDataReader reader, int rowNum)
        {
            var dto = new List<String>();

            if (DbUtil.FieldExists(reader, "Trimestre"))
            {
                dto.Add(reader.GetString(reader.GetOrdinal("Trimestre")).ToString());
            }
            else
            {
                dto.Add(String.Empty);
            }
            return dto;
        }

        /// <summary>
        /// Obtiene el listado de periodicidades disponibles.
        /// </summary>
        /// <returns>Listado de periodicidades disponibles.</returns>
        public IList<OptionItemDto> ObtenOpcionesPeriodicidad() 
        {

            var builder = CreateDbParametersBuilder();

            var opcionesPeriodicidad = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, CONSULTA_PERIODICIDADES,
                delegate(IDataReader reader, int rowNum) { return CrearElementoOpcion(reader, rowNum); },
                builder.GetParameters());
            return opcionesPeriodicidad;
        }
        /// <summary>
        /// Obtiene un listado con el detalle de las taxonomías disponibles.
        /// </summary>
        /// <returns>Listado de taxonomías XBRL disponibles.</returns>
        public IList<TaxonomiaXbrlDto> ObtenDetalleTaxonomias()
        {

            var builder = CreateDbParametersBuilder();

            var taxonomiasXbrl = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, CONSULTA_TAXONOMIAS,
                delegate(IDataReader reader, int rowNum) { return CrearDetalleTaxonomiaXbrl(reader, rowNum); },
                builder.GetParameters());
            return taxonomiasXbrl;
        }
        /// <summary>
        /// Obtiene el listado de Ejercicios disponibles
        /// </summary>
        /// <returns></returns>
        public IList<IList<string>> ObtenerEjercicios()
        {
            var builder = CreateDbParametersBuilder();

            var ejercicios = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, CONSULTA_EJERCICIOS,
                delegate (IDataReader reader, int rowNum) { return CrearDetalleEjercicios(reader, rowNum); },
                builder.GetParameters());
            return ejercicios;
        }
        /// <summary>
        /// Obtiene el listado de Trimestres disponibles
        /// </summary>
        /// <returns></returns>
        public IList<IList<string>> ObtenerTrimestres()
        {
            var builder = CreateDbParametersBuilder();

            var trimestres = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, CONSULTA_TRIMESTRE,
                delegate (IDataReader reader, int rowNum) { return CrearDetalleTrimestres(reader, rowNum); },
                builder.GetParameters());
            return trimestres;
        }

        public PeticionDataTableDto<IList<IList<string>>> ConsultaInformacionDataTable(PeticionDataTableDto<IList<IList<string>>> peticionDataTableDto)
        {
            var builder = CreateDbParametersBuilder();
            var query = CONSULTA_DATA_TABLE_TODOS;
            var prefixDoc = "DOC";
            var prefixTax = "TAX";
            if (peticionDataTableDto.filtros.ContainsKey("periodicidad"))
            {
                var periodicidadStr = peticionDataTableDto.filtros["periodicidad"].ToString().Trim();
                switch (periodicidadStr)
                {
                    case "4":
                        query = CONSULTA_DATA_TABLE_TODOS_ENVIOS;
                        break;
                    case "2":
                        query = CONSULTA_DATA_TABLE_ENVIOS_MENSUAL;
                        break;
                    default:
                        query = CONSULTA_DATA_TABLE_ULTIMOS_ENVIOS;
                        break;
                }
            }
            else {
                prefixDoc = "T1";
                prefixTax = "T1";
            }

            if (peticionDataTableDto.filtros.ContainsKey("clavePizarra"))
            {
                query += " AND UPPER("+ prefixDoc + ".ClaveEmisora) LIKE '%' + UPPER('" + peticionDataTableDto.filtros["clavePizarra"] + "') + '%' ";
            }
            if (peticionDataTableDto.filtros.ContainsKey("taxonomia"))
            {
                query += " AND " + prefixTax + ".IdTaxonomiaXbrl= " + peticionDataTableDto.filtros["taxonomia"];
            }
            if (peticionDataTableDto.filtros.ContainsKey("ejercicio"))
            {
                query += " AND " + prefixDoc + ".Anio= " + peticionDataTableDto.filtros["ejercicio"];
            }            
            if (peticionDataTableDto.filtros.ContainsKey("trimestre"))
            {
                query += " AND UPPER(isnull(" + prefixDoc + ".Trimestre,'')) = UPPER('" + peticionDataTableDto.filtros["trimestre"] + "') ";
            }

            if (peticionDataTableDto.filtros.ContainsKey("mensual"))
            {
                query += " AND MONTH(" + prefixDoc + ".FechaReporte) = " + peticionDataTableDto.filtros["mensual"];
            }
            if (peticionDataTableDto.filtros.ContainsKey("periodicidad"))
            {
                query += " AND " + prefixTax + ".IdPeriodicidadReporte = " + peticionDataTableDto.filtros["periodicidad"];
            }
            if (peticionDataTableDto.filtros.ContainsKey("search"))
            {
                var search = peticionDataTableDto.filtros["search"];
                query += " AND (UPPER(isnull(" + prefixDoc + ".ClaveEmisora, '')) like UPPER('%" + search+ "%') or  UPPER(" + prefixTax + ".Nombre) like UPPER('%" + search + "%'))";
            }
            if (peticionDataTableDto.order.Count > 0)
            {
                var orderQuery = String.Empty;

                foreach (var order in peticionDataTableDto.order)
                {
                    if (order.column == 0)
                    {
                        if (order.dir == "desc")
                        {
                            orderQuery += "," + prefixDoc + ".IdDocumentoInstancia DESC";
                        }
                        else
                        {
                            orderQuery += "," + prefixDoc + ".IdDocumentoInstancia";
                        }
                    }
                    if (order.column == 2)
                    {
                        if (order.dir == "desc")
                        {
                            orderQuery += "," + prefixDoc + ".FechaCreacion DESC";
                        }
                        else
                        {
                            orderQuery += "," + prefixDoc + ".FechaCreacion";
                        }
                    }
                    if (order.column == 3)
                    {
                        if (order.dir == "desc")
                        {
                            orderQuery += "," + prefixDoc + ".ClaveEmisora DESC";
                        }
                        else
                        {
                            orderQuery += "," + prefixDoc + ".ClaveEmisora";
                        }
                    }
                    if (order.column == 4)
                    {
                        if (order.dir == "desc")
                        {
                            orderQuery += ",CAST(YEAR(" + prefixDoc + ".FechaReporte) AS varchar) + isnull(' - ' + " + prefixDoc + ".Trimestre, '') DESC";
                        }
                        else
                        {
                            orderQuery += ",CAST(YEAR(" + prefixDoc + ".FechaReporte) AS varchar) + isnull(' - ' + " + prefixDoc + ".Trimestre, '')";
                        }
                    }
                    if (order.column == 5)
                    {
                        if (order.dir == "desc")
                        {
                            orderQuery += "," + prefixTax + ".Taxonomia DESC";
                        }
                        else
                        {
                            orderQuery += "," + prefixTax + ".Taxonomia";
                        }
                    }


                }

                query += " ORDER BY " + orderQuery.Substring(1);
            }

            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, query,
               delegate (IDataReader reader, int rowNum) { return CrearDocumentoDataTableInstancia(reader, rowNum); },
               builder.GetParameters());
            peticionDataTableDto.recordsTotal = documentosInstancia.Count();
            peticionDataTableDto.data = documentosInstancia.Skip(peticionDataTableDto.start).Take(peticionDataTableDto.length).ToList();
            

            return peticionDataTableDto;
        }

        
        public PeticionDataTableDto<IList<IList<string>>> ConsultaHistoricoEnvioDataTable(PeticionDataTableDto<IList<IList<string>>> peticionDataTableDto)
        {
            var builder = CreateDbParametersBuilder();
            var query = CONSULTA_DATA_TABLE_HISTORICO_ENVIOS.Replace("#id", peticionDataTableDto.filtros["id"].ToString()) ;
            
            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate(CommandType.Text, query,
               delegate (IDataReader reader, int rowNum) { return CrearDocumentoDataTableInstancia(reader, rowNum); },
               builder.GetParameters());
            peticionDataTableDto.recordsTotal = documentosInstancia.Count();
            peticionDataTableDto.data = documentosInstancia.ToList();
            
            return peticionDataTableDto;
        }

        /// <summary>
        /// Retorna un listado con los documentos de instancia XBRL disponibles para ser descargados.
        /// </summary>
        /// <returns>Lista de objetos de tipo DocumentoInstanciaDto.</returns>
        public IList<DocumentoInstanciaDto> ObtenEnviosDocumentoInstancia()
        {
            var query = "SELECT di.* " +
                        "FROM DocumentoInstancia di LEFT JOIN ArchivoDocumentoInstancia adi ON di.IdDocumentoInstancia = adi.IdDocumentoInstancia, " +
                             "(SELECT MAX(FechaCreacion) FechaCreacion, IdEmpresa, " +
                              "ISNULL(NumFideicomiso, 'NULL') NumFideicomiso, ISNULL(EspacioNombresPrincipal, 'NULL') EspacioNombresPrincipal, " +
                              "FechaReporte " +
                              "FROM DocumentoInstancia " +
                              "GROUP BY  IdEmpresa, NumFideicomiso, EspacioNombresPrincipal, FechaReporte " +
                              ") dmax " +
                        "WHERE di.IdEmpresa = dmax.IdEmpresa " +
                          "AND ((di.NumFideicomiso IS NULL AND dmax.NumFideicomiso = 'NULL') OR (di.NumFideicomiso IS NOT NULL AND di.NumFideicomiso = dmax.NumFideicomiso)) " +
                          "AND di.EspacioNombresPrincipal = dmax.EspacioNombresPrincipal " +
                          "AND di.FechaReporte = dmax.FechaReporte " +
                          "AND di.EspacioNombresPrincipal IS NOT NULL " +
                          "AND adi.IdTipoArchivo = 5 " +
                        "ORDER BY di.FechaReporte, di.EspacioNombresPrincipal, di.ClaveEmisora, di.NumFideicomiso";

            var builder = CreateDbParametersBuilder();

            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate<DocumentoInstanciaDto>(CommandType.Text, query,
               delegate (IDataReader reader, int rowNum) { return CrearDocumentoInstancia(reader, rowNum); },
               builder.GetParameters());
            return documentosInstancia.ToList();
        }
    }
}