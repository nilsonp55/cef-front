export const GENERALES = {
  
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
      ERROR_CONCILIATION: 'No se puede realizar la conciliación.',
      ERROR_OBTENER_CONCILIADOS: 'No se encuentran operaciones conciliadas',
      ERROR_OBTENER_CERTIFICADAS: 'No se encuentran operaciones certificadas no conciliadas',
      ERROR_OBTENER_PROGRAMADAS: 'No se encuentran operaciones programadas no conciliadas',
      ERROR_MODIFICACION: 'Error al realizar la modificación',
      MESSAGE_CIERRE_CONCILIACION: {
        SUCCESFULL_CIERRE_CONCILIACION: 'Se realizo el cierre de conciliación exitosamente',
        ERROR_CIERRE_FECHA_CONCILIACION: 'No se puede realizar el cierre de conciliación correctamente'
      },
    },
    MESSAGE_TRANSPORTE: {
      ERROR_TRANSPORTE: 'Error al consultar las transportadoras'
    },
    MESSAGE_BANCO: {
      ERROR_BANCO: 'Error al consultar los bancos'
    },
    MESSAGE_CIERRE_FECHA: {
      SUCCESFULL_CIERRE_FECHA: 'Se realizo el cierre de día exitosamente.',
      ERROR_CIERRE_FECHA: 'No se puede realizar el cierre del día correctamente'
    },
    MESSAGE_CIERRE_PROG_PRELIMINAR: {
      SUCCESFULL_CIERRE_PRELIMINAR: 'Se realizo el cierre de programación preliminar exitosamente',
      ERROR_CIERRE_FECHA_PRELIMINAR: 'No se puede realizar el cierre de programación preliminar correctamente'
    },
    MESSAGE_CIERRE_PROG_CERTIFICACION: {
      SUCCESFULL_CIERRE_CERTIFICACION: 'Se realizo el cierre de certificación exitosamente',
      ERROR_CIERRE_FECHA_CERTIFICACION: 'No se puede realizar el cierre de certificación correctamente'
    },
    MESSAGE_ADMIN_TIPO_CUNTAS: {
      ERROR_GET_TIPO_ADMIN_CUNTAS: 'No se puedo obtener la lista de Tipos Cuentas correctamente',
      SUCCESFULL_PERSIST_ADMIN_TIPO_CUNTAS: 'Se realizo el guardado de Tipo Cuenta exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CUNTAS: 'No se puedo gurdar el Tipo Cuenta correctamente'
    },
    MESSAGE_ADMIN_CUNTAS_PUC: {
      ERROR_GET_TIPO_ADMIN_CUNTAS_PUC: 'No se puedo obtener la lista de Cuentas Puc correctamente',
      SUCCESFULL_PERSIST_ADMIN_CUNTAS_PUC: 'Se realizo el guardado de Cuenta Puc exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CUNTAS_PUC: 'No se puedo gurdar el Cuenta Puc correctamente'
    },
    MESSAGE_ADMIN_CENTRO_CIUDAD: {
      ERROR_GET_TIPO_ADMIN_CENTRO_CIUDAD: 'No se puedo obtener la lista de Centro Ciudades correctamente',
      SUCCESFULL_PERSIST_ADMIN_CENTRO_CIUDAD: 'Se realizo el guardado de Centro Ciudades exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CENTRO_CIUDAD: 'No se puedo gurdar el Centro Ciudades correctamente'
    },
    MESSAGE_ADMIN_CENTRO_COSTOS: {
      ERROR_GET_TIPO_ADMIN_CENTRO_COSTOS: 'No se puedo obtener la lista de Centro Ciudades correctamente',
      SUCCESFULL_PERSIST_ADMIN_CENTRO_COSTOS: 'Se realizo el guardado de Centro Ciudades exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CENTRO_COSTOS: 'No se puedo gurdar el Centro Ciudades correctamente'
    },
    MESSAGE_CONTABILIDAD_PM: {
      SUCCESFULL_GENERATE_PM: 'Se realizo la contabilidad PM exitosamente',
      ERROR__GENERATE_PM: 'No se puedo realizar la contabilidad PM correctamente'
    },
    MESSAGE_CONTABILIDAD_AM: {
      SUCCESFULL_GENERATE_AM: 'Se realizo la contabilidad AM exitosamente',
      ERROR__GENERATE_AM: 'No se puedo realizar la contabilidad AM correctamente'
    },
    MESSAGE_GESTION_PUNTOS: {

    }
  },

   //-----------------------------------------------------------------------------------------------------------------
  //Variables y constantes para parametrización
  //-----------------------------------------------------------------------------------------------------------------

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

  //Log procesos diarios 
  LOG_PROCESOS_DIARIOS: {
    PROCESO: {
      CARG_PRELIMINAR: "CARG_PRELIMINAR",
      CARG_DEFINITICO: "CARG_DEFINITICO",
      CONCILIACION: "CONCILIACION"
    },

    ESTADO: {
      COMPLETO: "COMPLETO",
      PROCESO: "PROCESO"
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
  CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS: 'IPPSV',
  CARGUE_DEFINITIVO_PROGRAMACION_SERVICIOS: 'DEFIN',
  CARGUE_SERVICIOS_RECOLECCION_PROVICION: 'ISRPO',
  CARGUE_CERTIFICACION_PROGRAMACION_SERVICIOS: 'CERTI',

  //Tipo de punto
  TIPO_PUNTOS: {
    BANCO: "BANCO",
    BAN_REP: "BAN_REP",
    CAJERO: "CAJERO",
    CLIENTE: "CLIENTE",
    FONDO: "FONDO",
    OFICINA: "OFICINA"
  },

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
  CIERRE_FECHA_CIERRE: '/cerrar',

  //Listar dominios
  DOMINIO: '/dominio-funcional',
  DOMINIO_CONSULTA: '/consultar',

  //Consultar parametro
  PARAMETRO: '/parametro',
  PARAMETRO_CONSULTA: '/consultar',

  //Listar ciudades
  CIUDADES: '/ciudad',
  CIUDADES_CONSULTA: '/consultar',

  //Proceso diario
  PROCESO_DIARIO: '/proceso-diario',
  PROCESO_DIARIO_CONSULTAR: '/consultar',

  //Gestion puntos
  GESTION_PUNTOS: '/punto',
  CONSULTAR_PUNTOS: '/consultar',
  GUARDAR_PUNTO: '/guardar',

  //Administración tipos cuentas 
  ADMIN_TIPOS_CUENTAS: '/tipo-cuentas',
  ADMIN_TIPOS_CUENTAS_CONSULTAR: '/consultar',
  ADMIN_TIPOS_CUENTAS_GUARDAR: '/guardar',
  ADMIN_TIPOS_CUENTAS_ACTUALIZAR: '/actualizar',

  //Administración cuentas puc 
  ADMIN_CUENTAS_PUC: '/cuentas-puc',
  ADMIN_CUENTAS_PUC_CONSULTAR: '/consultar',
  ADMIN_CUENTAS_PUC_GUARDAR: '/guardar',
  ADMIN_CUENTAS_PUC_ACTUALIZAR: '/actualizar',

  //Administración cuentas contables 
  ADMIN_CUENTAS_CONTABLES: '/cuentas-contables',
  ADMIN_CUENTAS_CONTABLES_CONSULTAR: '/consultar',
  ADMIN_CUENTAS_CONTABLES_GUARDAR: '/guardar',
  ADMIN_CUENTAS_CONTABLES_ACTUALIZAR: '/actualizar',

  //Administración centro costos 
  ADMIN_TIPO_CENTRO_COSTOS: '/tipo-centro-costos',
  ADMIN_TIPO_CENTRO_COSTOS_CONSULTAR: '/consultar',
  ADMIN_TIPO_CENTRO_COSTOS_GUARDAR: '/guardar',
  ADMIN_TIPO_CENTRO_COSTOS_ACTUALIZAR: '/actualizar',

  //Administración centro ciudad 
  ADMIN_CENTRO_CIUDAD: '/centro-ciudad',
  ADMIN_CENTRO_CIUDAD_CONSULTAR: '/consultar',
  ADMIN_CENTRO_CIUDAD_GUARDAR: '/guardar',
  ADMIN_CENTRO_CIUDAD_ACTUALIZAR: '/actualizar',
  
};

export const ROLES = [
  { code: 'ROL_1', description: 'Descripcion Rol' },
  { code: 'ROL_2', description: 'Descripcion Rol' },
  { code: 'ROL_3', description: 'Descripcion Rol' },
  { code: 'ROL_4', description: 'Descripcion Rol' },
  { code: 'ROL_5', description: 'Descripcion Rol' }
];


