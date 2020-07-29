using System;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.Xml;
using System.Text;
using System.IO;
using System.Collections.Generic;
using System.Xml.Linq;
using System.Net.Http.Headers;
using AbaxXBRLViewerWeb.Common.Util;
using AbaxXBRLViewerWeb.Common.Integration.Dao;
using AbaxXBRLViewerWeb.Common.Aplication.Service;
using AbaxXBRLViewerWeb.Common.Integration.Dao.Impl;

namespace AbaxXBRLWeb.Controllers
{
    [RoutePrefix("RSS")]
    public class RssController : ApiController
    {
        /// <summary>
        /// Acceso a informacion del RSS.
        /// </summary>
        public IRssDao RssDao { get; set; }

        public RssController()
        {
            try
            {
                RssDao = (IRssDao)ServiceLocator.ObtenerFabricaSpring().GetObject("RssDao");
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex);
                throw;
            }
        }

        [HttpGet]
        [Route("GetRSS")]
        public HttpResponseMessage ConsultarRSS()
        {
            var pathXML = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/rss.xml");
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            if(File.Exists(pathXML))
            {
                var stream = new FileStream(pathXML, FileMode.Open);
                var lastModified = System.IO.File.GetLastWriteTime(pathXML);
                result.Content = new StreamContent(stream);
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = "cnbv.rss.xml";
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/rss+xml");
                result.Content.Headers.ContentLength = stream.Length;
                result.Content.Headers.LastModified = lastModified;
            }
            else
            {
                result.Content = new StringContent(RssDao.ObtenerRssListadoDocumentosInstancia());
                result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
                result.Content.Headers.ContentDisposition.FileName = "cnbv.rss.xml";
                result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/rss+xml");
            }
            return result;
        }

        [HttpGet]
        [Route("GetRSSByQuery")]
        public HttpResponseMessage GetRSSByQuery ()
        {
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new StringContent(RssDao.ObtenerRssListadoDocumentosInstancia());
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = "cnbv.rss.xml";
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/rss+xml");
            return result;
        }

        [HttpGet]
        [Route("LastSend")]
        public HttpResponseMessage LastSend ()
        {
            DateTime fechaUltimaActualizacion = RssDao.ObtenFechaUltimoEnvioDocumentoInstancia();
            var response = new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(
                    "{\"lastUpdate\": \"" + fechaUltimaActualizacion.ToString("yyyy-MM-ddTHH:mm:ss.000Z") + "\"}",
                    Encoding.UTF8,
                    "application/json")
            };
            return response;
        }

        [HttpGet]
        [Route("LastUpdate")]
        public HttpResponseMessage GetLastUpdateFileRSS()
        {
            var pathXML = System.Web.HttpContext.Current.Server.MapPath("~/App_Data/rss.xml"); ;
            DateTime fechaUltimaActualizacion = File.GetLastWriteTime(pathXML);
            var response = new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(
                    "{\"lastUpdate\": \"" + fechaUltimaActualizacion.ToString("yyyy-MM-ddTHH:mm:ss.000Z") + "\"}",
                    Encoding.UTF8,
                    "application/json")
            };
            return response;
        }

    }

}
