﻿using System;
using System.Dynamic;
namespace AbaxXBRLViewerWeb.Common.Aplication.Dto
{
    /// <summary>
    /// Data Transfer Object que representa el resultado de una operación .
    /// <author>José Antonio Huizar Moreno</author>
    /// <version>1.0</version>
    /// </summary>
    public class ResultadoOperacionDto
    {
        /// <summary>
        /// Indica el resultado de la operación, True si es que tuvo éxito. False en cualquier otro caso.
        /// </summary>
        public bool Resultado { get; set; }
        /// <summary>
        /// Contiene una descripción detallada del resultado de la operación. En caso de tener éxito es posible que no contenga información este campo.
        /// </summary>
        public String Mensaje { get; set; }
        /// <summary>
        /// Informacion extras relacionados con la invoación de la operación.
        /// </summary>
        public object InformacionExtra { get; set; }

        /// <summary>
        /// Contiene la información de la excepción generada por el servidor
        /// </summary>
        public String Excepcion { get; set; }
        /// <summary>
        /// Consutructor de ResultadoOperaionDto
        /// </summary>


    }
}
