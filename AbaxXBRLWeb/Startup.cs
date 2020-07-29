using System.Web.Script.Serialization;
using Microsoft.Owin;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using AbaxXBRLViewerWeb.Common.Util;

[assembly: OwinStartup(typeof(AbaxXBRLViewerWeb.Startup))]
namespace AbaxXBRLViewerWeb
{
    public class Startup
    {

        public Startup()
        {
            InicializaLog();
        }

        public void Configuration(IAppBuilder app)
        {
            try 
            {
                HttpConfiguration config = new HttpConfiguration();
                var json = GlobalConfiguration.Configuration.Formatters.JsonFormatter;
                json.SerializerSettings.DateFormatHandling = Newtonsoft.Json.DateFormatHandling.MicrosoftDateFormat;

                WebApiConfig.Register(config);
                app.UseWebApi(config);
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex);
                throw;
            }
        }

        /// <summary>
        /// Inicializa el archivo de escritura del log.
        /// </summary>
        private void InicializaLog()
        {
            try
            {
                LogUtil.LogDirPath = HttpContext.Current.Server.MapPath("~/App_Data/");
                LogUtil.Inicializa();
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());

            }
        }





    }
}