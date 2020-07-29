using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml;
using Ionic.Zip;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Globalization;
using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using AbaxXBRLViewerWeb.Common.Integration.Dao;
using AbaxXBRLViewerWeb.Common.Aplication.Service;
using AbaxXBRLCore.Common.Constants;
using System.Configuration;
using AbaxXBRLViewerWeb.Common.Util;

namespace AbaxXBRLWeb.Controllers
{
    /// <summary>
    /// Controlador para la atención de las peticiones REST para el procesaminto de documentos de instancia
    /// <author>Emigdio Hernández</author>
    /// </summary>
    [RoutePrefix("DocumentoInstancia")]
    public class DocumentoInstanciaController : BaseController
    {

        /// <summary>
        /// Acceso a informacion de los documentos instancia
        /// </summary>
        private IDocumentoInstanciaDao DocumentoInstanciaDao = null;

        public DocumentoInstanciaController()
            : base()
        {

            DocumentoInstanciaDao = (IDocumentoInstanciaDao)ServiceLocator.ObtenerFabricaSpring().GetObject("DocumentoInstanciaDao");

        }

        /// <summary>
        /// Este método atiende las solicitudes para consultar los documentos instancia enviados
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("ConsultarEnviosInformacion")]
        public IHttpActionResult ConsultarEnviosInformacion()
        {


            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {
                var paginaSolicitada = getFormKeyValue("paginaSolicitada");
                var numeroRegistrosPorPagina = getFormKeyValue("numeroRegistrosPorPagina");
                var filtrosConsulta = getFormKeyValue("filtrosConsulta");


                var paginacion = new PaginacionSimpleDto<DocumentoInstanciaDto>();
                var paginacionDocumentos = DocumentoInstanciaDao.ObtenerDocumentosInstanciaPorPaginacion(paginacion);

                resultado.InformacionExtra = paginacionDocumentos;

                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }
                
            }

            return Json(resultado);

        }

        /// <summary>
        /// Este método atiende las solicitudes para consultar los documentos instancia enviados presentados en el DataTable
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("ConsultarEnviosInformacionDataTable")]
        public IHttpActionResult ConsultarEnviosInformacionDataTable()
        {
            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try { 
            var taxonomia = getFormKeyValue("taxonomia");
            var clavePizarra = getFormKeyValue("clavePizarra");
            var ejercicio = getFormKeyValue("ejercicio");
            var trimestre = getFormKeyValue("trimestre");
            var mensual = getFormKeyValue("mensual");
            var periocidad = getFormKeyValue("periodicidad");
            var buscar = getFormKeyValue("search[value]");


            var dataTableRequest = ObtenPeticionDataTable();
            dataTableRequest.filtros = new Dictionary<string, object>();

            if (!String.IsNullOrEmpty(taxonomia))
            {
                dataTableRequest.filtros["taxonomia"] = taxonomia;
            }
            if (!String.IsNullOrEmpty(clavePizarra))
            {
                dataTableRequest.filtros["clavePizarra"] = clavePizarra;
            }
            if (!String.IsNullOrEmpty(ejercicio))
            {
                dataTableRequest.filtros["ejercicio"] = ejercicio;
            }
            if (!String.IsNullOrEmpty(trimestre))
            {
                dataTableRequest.filtros["trimestre"] = trimestre;
            }
            if (!String.IsNullOrEmpty(mensual))
            {
                dataTableRequest.filtros["mensual"] = mensual;
            }
            if (!String.IsNullOrEmpty(periocidad))
            {
                dataTableRequest.filtros["periodicidad"] = periocidad;
            }
            if (!String.IsNullOrEmpty(buscar))
            {
                dataTableRequest.filtros["search"] = buscar;
            }
                var paginacionDocumentos = DocumentoInstanciaDao.ConsultaInformacionDataTable(dataTableRequest);

                resultado.InformacionExtra = paginacionDocumentos;

                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }

            return Json(resultado.InformacionExtra);

        }


        /// <summary>
        /// Este método atiende las solicitudes para consultar los documentos instancia re enviados presentados en el detalle del DataTable
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("ConsultarReEnviosInformacionDataTable")]
        public IHttpActionResult ConsultarHistoricoEnviosDataTable()
        {
            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {
                var id = getFormKeyValue("id");
                var dataTableRequest = ObtenPeticionDataTable();
                dataTableRequest.filtros = new Dictionary<string, object>();

                if (!String.IsNullOrEmpty(id))
                {
                    dataTableRequest.filtros["id"] = id;
                }
                
                var paginacionDocumentos = DocumentoInstanciaDao.ConsultaHistoricoEnvioDataTable(dataTableRequest);

                resultado.InformacionExtra = paginacionDocumentos;

                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }

            return Json(resultado.InformacionExtra);

        }


        /// <summary>
        /// Este método atiende las solicitudes para consultar los documentos instancia enviados
        /// </summary>
        /// <returns></returns>
        [HttpPost][HttpGet]
        [Route("BajarArchivoDocumentoInstancia")]
        public IHttpActionResult BajarArchivoDocumentoInstancia()
        {

            var response = new HttpResponseMessage();
            response.StatusCode = HttpStatusCode.NoContent;


            var idDocumentoInstancia = getFormKeyValue("idDocIns");
            var tipoArchivo = getFormKeyValue("tipoArchivo");
            var nombreArchivo = getFormKeyValue("nombreArchivo");
            ArchivoDocumentoInstanciaDto archivoDocumento = null;
            if (idDocumentoInstancia != null)
            {
                var cleanId = idDocumentoInstancia.Split('#');

                archivoDocumento = DocumentoInstanciaDao.ObtenerArchivoDocumentosInstancia(long.Parse(cleanId[0].Trim()), long.Parse(tipoArchivo));
            }

            
            if (archivoDocumento != null)
            {

                MemoryStream stream = new MemoryStream(archivoDocumento.Archivo);
                stream.Position = 0;

                response.StatusCode = HttpStatusCode.OK;
                response.Content = new StreamContent(stream);
                response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

                if (tipoArchivo.Equals(CommonConstants.TipoArchivoJSON))
                {
                    response.Content.Headers.ContentEncoding.Add("gzip");
                }
                else
                {
                    string extensionEliminar = System.IO.Path.GetExtension(nombreArchivo);
                    string result = nombreArchivo.Substring(0, nombreArchivo.Length - extensionEliminar.Length);

                    string extension = "pdf";
                    if (tipoArchivo.Equals(CommonConstants.TipoArchivoXLS))
                    {
                        extension = "xls";
                    }
                    else if (tipoArchivo.Equals(CommonConstants.TipoArchivoXbrlZip))
                    {
                        extension = "zip";
                    }
                    else if (tipoArchivo.Equals(CommonConstants.TipoArchivoXBRL))
                    {
                        extension = "xbrl";
                    }
                    else if (tipoArchivo.Equals(CommonConstants.TipoArchivoWord))
                    {
                        extension = "docx";
                    }


                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = result + "." + extension
                    };
                    var cookie = new CookieHeaderValue("fileDownload", "true");
                    response.Headers.AddCookies(new CookieHeaderValue[] { cookie });

                }

                return ResponseMessage(response);
            }
            else
            {
                response.StatusCode = HttpStatusCode.NoContent;
                return ResponseMessage(response);
            }
        }




        /// <summary>
        /// Este método atiende las solicitudes para consultar los documentos instancia enviados
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("ObtenerPropiedadesConfiguracion")]
        public IHttpActionResult ObtenerPropiedadesConfiguracion()
        {

            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {
                var propiedadesDiccionario = new Dictionary<string, string>();
                foreach(var setting in ConfigurationManager.AppSettings.AllKeys){
                    propiedadesDiccionario.Add(setting, ConfigurationManager.AppSettings[setting].ToString());
                }

                resultado.InformacionExtra = propiedadesDiccionario;

                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }

            return Json(resultado);

        }
        /// <summary>
        /// Obtiene las periodicidades existentes en el catálogo.
        /// </summary>
        /// <returns>Lista con las opciones para las periodicidades existentes en el catálogo.</returns>
        [HttpPost]
        [Route("ObtenerPeriodicidades")]
        public IHttpActionResult ObtenerPeriodicidades()
        {


            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {

                var opcionesPeriodicidad = DocumentoInstanciaDao.ObtenOpcionesPeriodicidad();
                resultado.InformacionExtra = opcionesPeriodicidad;
                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }
            return Json(resultado);
        }

        [HttpPost]
        [Route("ObtenerTaxonomias")]
        public IHttpActionResult ObtenerTaxonomias()
        {


            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {

                var listaDetalleTaxonomias = DocumentoInstanciaDao.ObtenDetalleTaxonomias();
                resultado.InformacionExtra = listaDetalleTaxonomias;
                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }
            return Json(resultado);
        }

        [HttpPost]
        [Route("ObtenerEjercicios")]
        public IHttpActionResult ObtenerEjercicios()
        {


            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {

                var listaDetalleEjercicio = DocumentoInstanciaDao.ObtenerEjercicios();
                resultado.InformacionExtra = listaDetalleEjercicio;
                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }
            return Json(resultado);
        }
        [HttpPost]
        [Route("ObtenerTrimestres")]
        public IHttpActionResult ObtenerTrimestres()
        {


            var resultado = new ResultadoOperacionDto();
            resultado.Resultado = false;
            try
            {

                var listaDetalleEjercicio = DocumentoInstanciaDao.ObtenerTrimestres();
                resultado.InformacionExtra = listaDetalleEjercicio;
                resultado.Resultado = true;
            }
            catch (Exception e)
            {
                LogUtil.Error(e);
                resultado.Mensaje = e.Message;
                resultado.Excepcion = e.StackTrace;
                if (e.InnerException != null)
                {
                    resultado.Mensaje += ":" + e.InnerException.Message;
                    resultado.Excepcion += ";" + e.InnerException.StackTrace;
                }

            }
            return Json(resultado);
        }

        private PeticionDataTableDto<IList<IList<string>>> ObtenPeticionDataTable()
        {
            String param;
            List<DataTableOrderColumn> orders = new List<DataTableOrderColumn>();
            for (var index = 0; index < 6; index++)
            {
                var columnKey = "order[" + index + "][column]";
                param = getFormKeyValue(columnKey);
                if (param != null)
                {
                    var dirKey = "order[" + index + "][dir]";
                    var orderItem = new DataTableOrderColumn()
                    {
                        column = Int32.Parse(param),
                        dir = getFormKeyValue(dirKey)
                    };
                    orders.Add(orderItem);
                }
            }

            var dataTableRequest = new PeticionDataTableDto<IList<IList<string>>>()
            {
                draw = Int32.Parse(getFormKeyValue("draw")),
                length = Int32.Parse(getFormKeyValue("length")),
                start = Int32.Parse(getFormKeyValue("start")),
                search = getFormKeyValue("search"),
                order = orders
            };
            return dataTableRequest;
        }

    }
}
