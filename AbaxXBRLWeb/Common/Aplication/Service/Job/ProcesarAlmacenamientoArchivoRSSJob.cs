

using AbaxXBRLViewerWeb.Common.Integration.Dao;
using AbaxXBRLViewerWeb.Common.Util;
using Quartz;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Configuration;


namespace AbaxXBRLViewerWeb.Common.Aplication.Service.Job
{
    /**
     * Proceso para la actualización del archivo RSS
     */
    public class ProcesarAlmacenamientoArchivoRSSJob : IJob
    {
        /// <summary>
        /// Repository para acceso al archivo RSS
        /// </summary>
        public IRssDao RssDao { get; set; }

        public void Execute(JobExecutionContext context)
        {
            try
            {
                //var pathArchivoXML = WebConfigurationManager.AppSettings["pathArchivoRSSTest"];
                var pathArchivoXML = System.Web.Hosting.HostingEnvironment.MapPath("~/App_Data/rss.xml");
                JobDataMap dataMap = context.JobDetail.JobDataMap;
                var daoRss = (IRssDao)dataMap["RssDao"];


                if(!File.Exists(pathArchivoXML))

                {
                    try
                    {
                        if(daoRss == null)
                        {
                            LogUtil.Error("El Job de procesamiento de almacenamiento de archivo xml no tiene configurados los servicios que requiere");
                            return;
                        }
                        var xml = daoRss.ObtenerRssListadoDocumentosInstancia();
                        CrearArchivoRSSaXML(xml, pathArchivoXML);

                    }
                    catch(Exception e)
                    {

                        LogUtil.Error("***********************ERROR EN EL PROCESAMIENTO DEL ARCHIVO ****************************************************");
                        LogUtil.Error("ARCHIVO pathArchivoXML:" + pathArchivoXML);
                        LogUtil.Error(e);
                    }

                }
                else
                {
                    var fechaCreacion = daoRss.ObtenFechaUltimoEnvioDocumentoInstancia();
                    if(CompararArchivoXML(fechaCreacion, pathArchivoXML))
                    {
                        var xml = daoRss.ObtenerRssListadoDocumentosInstancia();
                        CrearArchivoRSSaXML(xml, pathArchivoXML);
                    }

                }
            }
            catch(Exception ex)
            {
                LogUtil.Error(ex);
            }
        }

        private void CrearArchivoRSSaXML(String xml, String path)
        {
            File.Create(path).Dispose();

            using (TextWriter tw = new StreamWriter(path))
            {
                tw.WriteLine(xml);
                tw.Close();
            }

        }

        private Boolean CompararArchivoXML(DateTime fecha, String path)
        {
            DateTime lastWriteTimeFile = File.GetLastWriteTime(path);

            if(fecha > lastWriteTimeFile)
            {
                return true;
            }

            return false;
        }


    }
}