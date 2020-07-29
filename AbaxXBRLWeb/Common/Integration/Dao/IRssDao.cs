
using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using System;
using System.Collections.Generic;

namespace AbaxXBRLViewerWeb.Common.Integration.Dao
{
    /// <summary>
    /// Interfaz para la obtención del RSS de documentos de instancia enviados.
    /// <author>Angel de Jesús Cruz Gómez</author>
    /// </summary>
    public interface IRssDao
    {

        /// <summary>
        /// Obtiene los ultimos documentos de instancia en una cadena con formato xml.
        /// </summary>
        /// <returns></returns>
        string ObtenerRssListadoDocumentosInstancia();

        /// <summary>
        /// Obtiene la fecha de la última modificación al archivo RSS.
        /// </summary>
        /// <returns></returns>
        string ObtenerRssFechaUltimaModificacion ();

        /// <summary>
        /// Obtiene el ultimo Documento de instancia insertado a la DB
        /// </summary>
        /// <returns></returns>
        DocumentoInstanciaDto ObtenerUltimoRegistroDocumentoInstancia();

        /// <summary> 
        /// Retorna un listado con los documentos de instancia XBRL disponibles para ser descargados. 
        /// </summary> 
        /// <returns>Lista de objetos de tipo DocumentoInstanciaDto.</returns> 
        IList<DocumentoInstanciaDto> ObtenEnviosDocumentoInstancia();

        /// <summary>
        /// Retorna la fecha del último envío recibido por CNBV
        /// </summary>
        /// <returns>Fecha del último envío.</returns>
        DateTime ObtenFechaUltimoEnvioDocumentoInstancia ();

    }
}
