export const GENERALES = {
  //General
  FECHA_PATTERN1: 'dd-MM-yyyy',
  FECHA_PATTERN2: 'yyyy-MM-dd',
  FECHA_HORA_PATTERN: 'dd-MM-yyyy hh:mm:ss a',
  FECHA_HORA_PATTERN_EXCEL: 'dd_MM_yyyy_hh:mm:ss',
  HORA_PATTERN: 'hh:mm:ss',
  SI: 'SI',
  NO: 'NO',
  ESTADO_ACTIVO: 'ACT',
  ESTADO_PENDIENTE: 'PEND',

  //Mensajes de ventana de alerta global
  MESSAGE_ALERT: {
    SIZE_WINDOWS_ALERT: '500px',
    MESSAGE_CRUD: {
      SUCCESFULL_UPDATE: 'Registro actualizado exitosamente',
      SUCCESFULL_CREATE: 'Se creo el registro exitosamente',
      SUCCESFULL_DELETE: 'Se elmino el registro sactisfactoriamente',
      ERROR_UPDATE: 'Error al actualizar el registro',
      ERROR_CREATE: 'Error al crear el registro',
      ERROR_DELETE: 'Error al elminar el registro',
      ERROR_DATA_FILE: 'Error ocurrido al obtener información de archivos',
    },
    MESSAGE_LOAD_FILE: {
      SUCCESFULL_DOWNLOAD_FILE: 'El archivo se descargo satisfactoriamente',
      SUCCESFULL_UPLOAD_FILE: 'El archivo se cargo satisfactoriamnente',
      SUCCESFULL_PROCESS_FILE: 'El archivo se proceso satisfactoriamnente',
      SUCCESFULL_VALIDATED_FILE: 'El archivo se valido satisfactoriamente',
      SUCCESFULL_DELETE_FILE: 'El archivo se elimino satisfactoriamente',
      ERROR_UPLOAD_FILE: 'Error al cargar el archivo',
      ERROR_VALIDATED_FILE: 'Error al validarl el archivo',
      ERROR_PROCESS_FILE: 'Error al procesar el archivo',
    },
    MESSAGE_CONCILIATION: {
      SUCCESFULL_CONCILIATION: 'Se realizo la conciliación exitosamente.',
      ERROR_CONCILIATION: 'No se puede realizar la conciliación.'
    },
    MESSAGE_CIERRE_FECHA: {
      SUCCESFULL_CIERRE_FECHA: 'Se realizo el cierre de día exitosamente.',
      ERROR_CIERRE_FECHA: 'No se puede realizar el cierre del día correctamente'
    }
  },

  //Codigos para la ventana de alerta global
  CODE_EMERGENT: {
    ERROR: 1,
    WARNING: 2,
    SUCCESFULL: 3
  },

  //Estados de conciliacion
  ESTADOS_CONCILIACION: {
    ESTADO_NO_CONCILIADO: 'No Conciliado'
  },

  //Codigos para el envio de tipo de archivos a cargar
  CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS: 'IPRSV',
  CARGUE_SERVICIOS_TRASLADO_RETIROS: 'ISTRC',
  CARGUE_SERVICIOS_RECOLECCION_PROVICION: 'ISRPO',
};

export const URLs = {
  //Api
  API_VERSION: '/v1.0.1/ade',

  //Cargue Archivos
  CARGUE_FILE: '/archivos',
  CARGUE_FILE_CONSULTAR: '/consultar',

  //Archivos cargados
  ARCHIVO_CARGADO: '/archivos-cargados',
  ARCHIVO_CARGADO_CONSULTA: '/consultar-page',
  CARGUE_ARCHIVO_GUARDAR: '/guardar',
  CARGUE_ARCHIVO_DESCARGAR: '/descargar-id',
  CARGUE_ARCHIVO_ELIMINAR: '/eliminar',

  //Programacion preliminar
  PROGRAMACION_PRELIMINAR: '/cargue-preliminar',
  PROGRAMACION_PRELIMINAR_VALIDAR: '/validar',
  PROGRAMACION_PRELIMINAR_PROCESAR: '/procesar',
  PROGRAMACION_PRELIMINAR_HISTORICO: '/detalle',

  //Programacion definitiva
  PROGRAMACION_DEFINITIVA: '/cargue-definitivo',
  PROGRAMACION_DEFINITIVA_VALIDAR: '/validar',
  PROGRAMACION_DEFINITIVA_CONSULTAR: '/consultar',
  PROGRAMACION_DEFINITIVA_PROCESAR: '/procesar',
  PROGRAMACION_DEFINITIVA_HISTORICO: '/detalle',

  //Conciliación
  CONCILIACION: '/conciliacion',
  CONCILIACION_CONSULTA: '/consultas/conciliadas',
  OP_PROGRAMADAS_SIN_CONCILIAR: '/consultas/programadas-no-conciliadas',
  OP_CERTIFICADAS_SIN_CONCILIAR: '/consultas/certificadas-no-conciliadas',
  OP_RESUMEN: '/consultas/resumen',
  CONCILIACION_MANUAL: '/conciliacion/conciliacionmanual',
  CONCILIACION_RESUMEN: '/conciliacion/conciliacionmanual',
  DESCONCILIAR: 'desconciliaciones',

  //Listar transportadoras
  TRANSPORTADORA: '/transportadoras',
  TRANSPORTADORA_CONSULTA: '/consultar',

  //Listar bancos
  BANCOS: '/bancos',
  BANCO_CONSULTA: '/consultar',

  //Cierre de fecha
  CIERRE_FECHA: '/cierre-dia',
  CIERRE_FECHA_CIERRE: '/cerrar'
  
};

export const ROLES = [
  { code: 'ROL_1', description: 'Descripcion Rol' },
  { code: 'ROL_2', description: 'Descripcion Rol' },
  { code: 'ROL_3', description: 'Descripcion Rol' },
  { code: 'ROL_4', description: 'Descripcion Rol' },
  { code: 'ROL_5', description: 'Descripcion Rol' }
];


