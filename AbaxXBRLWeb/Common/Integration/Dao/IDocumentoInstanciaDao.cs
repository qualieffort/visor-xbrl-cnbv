using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AbaxXBRLViewerWeb.Common.Integration.Dao
{
    /// <summary>
    /// Interfaz para manejo de informacion de los documentos instancia envidos
    /// </summary>
    public interface IDocumentoInstanciaDao
    {

        /// <summary>
        /// Obtiene los ultimos documentos documentos instancia enviados con los filtros y paginación indicada
        /// </summary>
        /// <returns>Listado de documentos instancia</returns>
        PaginacionSimpleDto<DocumentoInstanciaDto> ObtenerDocumentosInstanciaPorPaginacion(PaginacionSimpleDto<DocumentoInstanciaDto> parginacion);

        /// <summary>
        /// Obtiene un archivo asignado a un documento instancia
        /// </summary>
        /// <param name="idDocumentoInstancia">Identificador del documento instancia</param>
        /// <param name="idTipoArchivo">Identificador del tipo de archivo</param>
        /// <returns>Informacion de un archivo documento instancia</returns>
        ArchivoDocumentoInstanciaDto ObtenerArchivoDocumentosInstancia(long idDocumentoInstancia, long idTipoArchivo);
        /// <summary>
        /// Obtiene el listado de periodicidades disponibles.
        /// </summary>
        /// <returns>Listado de periodicidades disponibles.</returns>
        IList<OptionItemDto> ObtenOpcionesPeriodicidad();

        /// <summary>
        /// Obtiene un listado con el detalle de las taxonomías disponibles.
        /// </summary>
        /// <returns>Listado de taxonomías XBRL disponibles.</returns>
        IList<TaxonomiaXbrlDto> ObtenDetalleTaxonomias();
        /// <summary>
        /// Obtiene el listado de Ejercicios disponibles
        /// </summary>
        /// <returns></returns>
        IList<IList<string>> ObtenerEjercicios();
        /// <summary>
        /// Obtiene el listado de los trimestres disponibles
        /// </summary>
        /// <returns></returns>
        IList<IList<string>> ObtenerTrimestres();
        /// <summary>
        /// Obtiene la información necesario para popular la tabla de un componente tipo DataTable
        /// </summary>
        /// <param name="peticionDataTableDto">Solicitud del componente DataTable</param>
        /// <returns>Información Requerida</returns>
        PeticionDataTableDto<IList<IList<string>>> ConsultaInformacionDataTable(PeticionDataTableDto<IList<IList<string>>> peticionDataTableDto);

        /// <summary>
        /// Retorna un listado con los documentos de instancia XBRL disponibles para ser descargados.
        /// </summary>
        /// <returns>Lista de objetos de tipo DocumentoInstanciaDto.</returns>
        IList<DocumentoInstanciaDto> ObtenEnviosDocumentoInstancia();

        /// <summary>
        /// Obtiene el detalle del registro seleccionado de la tabla DataTable.
        /// </summary>
        /// <param name="peticionDataTableDto">Solicitud del componente DataTable</param>
        /// <returns>Información Requerida</returns>
        PeticionDataTableDto<IList<IList<string>>> ConsultaHistoricoEnvioDataTable(PeticionDataTableDto<IList<IList<string>>> peticionDataTableDto);

    }
}
