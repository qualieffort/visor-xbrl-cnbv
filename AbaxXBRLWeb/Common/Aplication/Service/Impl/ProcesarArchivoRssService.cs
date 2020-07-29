using AbaxXBRLCore.Common.Constants;
using AbaxXBRLViewerWeb.Common.Aplication.Dto;
using AbaxXBRLViewerWeb.Common.Aplication.Service;
using AbaxXBRLViewerWeb.Common.Aplication.Service.Job;
using AbaxXBRLViewerWeb.Common.Integration.Dao;
using AbaxXBRLViewerWeb.Common.Util;
using Quartz;
using Quartz.Impl;
using Spring.Transaction.Interceptor;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;

namespace AbaxXBRLViewerWeb.Common.Aplication.Service.Impl
{
    
    /// <summary>
    /// Implementación del servicio para el procesamiento del archivo RSS
    /// </summary>
    public class ProcesarArchivoRssService
    {

        /// <summary>
        /// Repository para acceso al archivo RSS
        /// </summary>
        public IRssDao RssDao { get; set; }
        /// <summary>
        /// Expresion para la ejecución de cada cierto tiempo el detalle de hechos contextos de la ultima versión de un documento instancia
        /// </summary>
        public string CronExpresionJobArchivoRSS { get; set; }

        //private static char SEPARADOR_CAMPOS = '|';
        //private static string FORMATO_FECHA_ARCHIVOS = "ddMMyyyy";

        
        /// <summary>
        /// Verifica si las cadenas cambiaron
        /// </summary>
        /// <param name="valorOriginal"></param>
        /// <param name="valorComparar"></param>
        /// <returns></returns>
        private bool ValorDiferente(string valorOriginal, string valorComparar)
        {
            if (valorOriginal == null && valorComparar == null)
            {
                return false;
            }
            if ((valorOriginal == null && valorComparar != null) || (valorOriginal != null && valorComparar == null))
            {
                return true;
            }
            return valorComparar.Equals(valorOriginal);
        }
       
        /// <summary>
        /// Determina si el JOB esta en ejecución.
        /// </summary>
        /// <param name="jobName">Nombre del JOB</param>
        /// <param name="jobGroup">Grupo al que pertenece.</param>
        /// <param name="scheduler">Esquema de ejecución.</param>
        /// <returns>Si existe el JOB indicado.</returns>
        private bool EstaCorriendoJob(String jobName, String jobGroup, IScheduler scheduler)
        {
            var enEjecucion = false;
            try
            {
                
                foreach (JobExecutionContext jobCtx in scheduler.GetCurrentlyExecutingJobs())
                {
                    var itemJobName = jobCtx.JobDetail.Name;
                    var itemGroupName = jobCtx.JobDetail.Group;
                    if (!String.IsNullOrWhiteSpace(itemJobName) && itemJobName.ToLower().Equals(jobName.ToLower()))
                    {
                        if (!String.IsNullOrWhiteSpace(jobGroup))
                        {
                            if (String.IsNullOrWhiteSpace(itemGroupName) || !itemGroupName.ToLower().Equals(jobGroup.ToLower()))
                            {
                                continue;
                            }
                        }
                        enEjecucion = true;
                        break;
                    }
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex);
            }
            return enEjecucion;
        }

        /// <summary>
        /// Inicia el proceso de almacenamiento de archivo xml RSS
        /// </summary>
        public void InicializarProcesoAlmacenamientoArchivoRSS()
        {
            try
            {
                ISchedulerFactory schedFact = new StdSchedulerFactory();
                IScheduler sched = schedFact.GetScheduler();
                sched.Start();
                var jobName = "ProcesarAlmacenamientoArchivoRSSJob";
                if (EstaCorriendoJob(jobName, null, sched))
                {
                    LogUtil.Error("Ya se esta ejecutando el JOB \"" + jobName + "\" en el sistema.");
                    return;
                }
                JobDetail jobDetail = new JobDetail(jobName, null, typeof(ProcesarAlmacenamientoArchivoRSSJob));
                jobDetail.JobDataMap["RssDao"] = RssDao;

                var cronExpresionJobArchivoRSS = WebConfigurationManager.AppSettings["cronExpresionJobArchivoRSS"];

                if (CronExpresionJobArchivoRSS != null)
                {
                    CronTrigger trigger = new CronTrigger();
                    trigger.CronExpressionString = CronExpresionJobArchivoRSS;
                    trigger.Group = "sincronizacion";
                    trigger.Description = "Ejecucion del cron para el procesamiento del almacenamiento del archivo xml RSS";
                    trigger.JobName = "ProcesarAlmacenamientoArchivoRSSJob";
                    trigger.Name = "almacenamientoArchivoRSSTrigger";

                    var existingsJobs = sched.GetCurrentlyExecutingJobs();

                    sched.ScheduleJob(jobDetail, trigger);
                }
            }
            catch (Exception ex)
            {
                LogUtil.Error(ex);
            }
        }

    }
}
