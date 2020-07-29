using System.Collections.Generic;
using AbaxXBRLViewerWeb.Common.Aplication.Service;
using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using System;
using System.ServiceModel.Syndication;
using System.IO;
using System.Xml;
using System.Text;
using System.Data;
using AbaxXBRLViewerWeb.Common.Util;
using System.Linq;
using System.Configuration;
using Quartz;
using Quartz.Impl;

namespace AbaxXBRLViewerWeb.Common.Integration.Dao.Impl
{
    /// <summary>
    /// Implemntación del acceso a datos de los documentos instancia para la generación de un RSS.
    /// <author>Angel de Jesús Cruz Gómez</author>
    /// <version>1.0</version>
    /// </summary>
    public class RssDao : BaseDAO, IRssDao
    {

        public const string QUERY_RSS_FILES =
            "SELECT * FROM ( " +
                "SELECT DOC.*  " +
                "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal)  " +
                  ",(SELECT ISNULL(IdEmpresa,-1) AS 'IdEmpresa', ISNULL(EspacioNombresPrincipal,'null') AS 'EspacioNombresPrincipal', ISNULL(Anio,-1) AS 'Anio', ISNULL(Trimestre,-1) AS 'Trimestre', MAX(FechaCreacion) AS 'FechaCreacion'  " +
                    "FROM DocumentoInstancia  " +
                    "GROUP BY IdEmpresa, EspacioNombresPrincipal, Anio, Trimestre ,NumFideicomiso  " +
                   ") TMAX  " +
                "WHERE TMAX.IdEmpresa = ISNULL(DOC.IdEmpresa,-1)  " +
                  "AND TMAX.EspacioNombresPrincipal = ISNULL(DOC.EspacioNombresPrincipal,'null')  " +
                  "AND TMAX.Anio = ISNULL(DOC.Anio,-1)  " +
                  "AND TMAX.Trimestre = ISNULL(DOC.Trimestre,-1)  " +
                  "AND TMAX.FechaCreacion = DOC.FechaCreacion  " +
                  "AND TAX.MostrarVisorExterno = 1  " +
                  "AND TAX.IdPeriodicidadReporte != 4  " +
                  "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) " +
                "UNION ALL " +
                "SELECT DOC.* " +
                "FROM DocumentoInstancia DOC LEFT OUTER JOIN TaxonomiaXbrl TAX ON LOWER(DOC.EspacioNombresPrincipal) = LOWER(TAX.EspacioNombresPrincipal)  " +
                "WHERE TAX.MostrarVisorExterno = 1  " +
                  "AND TAX.IdPeriodicidadReporte = 4 " +
                  "AND NOT EXISTS (SELECT IdDocumentoInstancia FROM UsuarioDocumentoInstancia UDO WHERE UDO.IdDocumentoInstancia=DOC.IdDocumentoInstancia) " +
            ") AUXILIAR " +
            "ORDER BY FechaCreacion DESC";

        public const string QUERY_TOP_FILES = "SELECT TOP 1 * FROM DocumentoInstancia order by FechaCreacion Desc";

        /// <summary>
        /// Obtiene los ultimos documentos de instancia en una cadena con formato xml.
        /// </summary>
        /// <returns></returns>
        public string ObtenerRssListadoDocumentosInstancia()
        {
            IList<DocumentoInstanciaDto> listaDocumentosInstancia = this.ObtenEnviosDocumentoInstancia();
            var dominio = ConfigurationManager.AppSettings.Get("urlCNBVViewer");

            SyndicationFeed feed = new SyndicationFeed();
            feed.Title = new TextSyndicationContent("RSS CNBV");
            feed.Description = new TextSyndicationContent("Servicio RSS de documentos de instancia de la Comisión Nacional Bancaria y de Valores (CNBV).");
            feed.BaseUri = new Uri(dominio);
            //feed.Authors.Add(new SyndicationPerson("someone@microsoft.com"));
            feed.Categories.Add(new SyndicationCategory("CNBV"));
            feed.ImageUrl = new Uri(dominio + "/Images/logo_cnbv_loading.png");

            List<SyndicationItem> itemList = new List<SyndicationItem>();

            foreach (DocumentoInstanciaDto documento in listaDocumentosInstancia)
            {
                DateTime utcTime1 = DateTime.SpecifyKind(documento.FechaCreacion.GetValueOrDefault(), DateTimeKind.Local);

                SyndicationItem item = new SyndicationItem(
                    documento.Titulo,
                    documento.ClaveEmisora + " " + documento.FechaReporte + " " + documento.EspacioNombresPrincipal,
                    new Uri(dominio + "/DocumentoInstancia/BajarArchivoDocumentoInstancia?idDocIns=" + documento.IdDocumentoInstancia + "&tipoArchivo=5&nombreArchivo=" + documento.Titulo),
                    documento.IdDocumentoInstancia.ToString(),
                    utcTime1);

                itemList.Add(item);
            }

            feed.Items = itemList;

            return SyndicationFeedToStringXML(feed);
        }

        /// <summary> 
        /// Retorna un listado con los documentos de instancia XBRL disponibles para ser descargados. 
        /// </summary> 
        /// <returns>Lista de objetos de tipo DocumentoInstanciaDto.</returns> 
        public IList<DocumentoInstanciaDto> ObtenEnviosDocumentoInstancia()
        {
            var builder = CreateDbParametersBuilder();
            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate<DocumentoInstanciaDto>(CommandType.Text, QUERY_RSS_FILES,
               delegate (IDataReader reader, int rowNum) { return CrearDocumentoInstancia(reader, rowNum); },
               builder.GetParameters());
            return documentosInstancia.ToList();
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
        /// Convierte el SyndicationFeed a una cadena en formato XML.
        /// </summary>
        /// <param name="syndicationFeed"></param>
        /// <returns></returns>
        public string SyndicationFeedToStringXML(SyndicationFeed syndicationFeed)
        {
            Rss20FeedFormatter rss20FeedFormatter = new Rss20FeedFormatter(syndicationFeed);

            MemoryStream output = new MemoryStream();
            String xml;

            var xws = new XmlWriterSettings { Encoding = Encoding.UTF8 };

            using (var xmlWriter = XmlWriter.Create(output, xws))
            {
                rss20FeedFormatter.WriteTo(xmlWriter);
                xmlWriter.Flush();
            }

            using (var sr = new StreamReader(output))
            {
                output.Position = 0;
                xml = sr.ReadToEnd();
                sr.Close();
            }

            return xml;
        }

        /// <summary>
        /// Retorna el ultimo Documento de instancia insertado a la DB
        /// </summary>
        /// <returns></returns>
        public DocumentoInstanciaDto ObtenerUltimoRegistroDocumentoInstancia()
        {
            var builder = CreateDbParametersBuilder();
            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate<DocumentoInstanciaDto>(CommandType.Text, QUERY_TOP_FILES,
               delegate (IDataReader reader, int rowNum) {
               return CrearDocumentoInstancia(reader, rowNum); },
               builder.GetParameters());
            return documentosInstancia.First();
        }
        /// <summary>
        /// Retorna la fecha del último envío recibido por CNBV
        /// </summary>
        /// <returns>Fecha del último envío.</returns>
        public DateTime ObtenFechaUltimoEnvioDocumentoInstancia ()
        {
            var builder = CreateDbParametersBuilder();
            var documentosInstancia = AdoTemplate.QueryWithRowMapperDelegate<DateTime>(CommandType.Text,
                "SELECT MAX(FechaCreacion) maxFecha FROM DocumentoInstancia WHERE EspacioNombresPrincipal IS NOT NULL",
               delegate (IDataReader reader, int rowNum) {
                   var fecha = DateTime.MinValue;
                   if(DbUtil.FieldExists(reader, "maxFecha"))
                   {
                       fecha = reader.GetDateTime(reader.GetOrdinal("maxFecha"));
                   }
                   return fecha;
               },
               builder.GetParameters());
            return documentosInstancia.First();
        }

        public string ObtenerRssFechaUltimaModificacion ()
        {
            throw new NotImplementedException();
        }
    }
}
