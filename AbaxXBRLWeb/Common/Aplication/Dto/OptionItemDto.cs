using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AbaxXBRLViewerWeb.Common.Aplication.Dto
{
    /// <summary>
    /// Elemento para un arreglo de opciones de un capo de selección.
    /// </summary>
    public class OptionItemDto
    {
        /// <summary>
        /// Valor de la opción
        /// </summary>
        public string Value { get; set; }
        /// <summary>
        /// Etiqueta de la opción.
        /// </summary>
        public string Label { get; set; } 
    }
}