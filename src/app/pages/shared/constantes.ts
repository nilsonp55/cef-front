export const GENERALES = {

  //Mensajes de ventana de alerta global
  MESSAGE_ALERT: {
    SIZE_WINDOWS_ALERT: '500px',
    MESSAGE_CRUD: {
      SUCCESFULL_UPDATE: 'Registro actualizado exitosamente',
      SUCCESFULL_CREATE: 'Se creo el registro exitosamente',
      SUCCESFULL_DELETE: 'Se elimino el registro satisfactoriamente',
      ERROR_UPDATE: 'Error al actualizar el registro',
      ERROR_CREATE: 'Error al crear el registro',
      ERROR_DELETE: 'Error al eliminar el registro',
      ERROR_DATA_FILE: 'Error ocurrido al obtener la lista de información',
      MSG_DELETE_ROW: '¿Confirma que desea eliminar el registro?',
    },
    MESSAGE_LOAD_FILE: {
      SUCCESFULL_DOWNLOAD_FILE: 'El archivo se descargo satisfactoriamente',
      SUCCESFULL_UPLOAD_FILE: 'El archivo se cargo satisfactoriamnente',
      SUCCESFULL_PROCESS_FILE: 'El archivo se proceso satisfactoriamnente',
      SUCCESFULL_VALIDATED_FILE: 'El archivo se valido satisfactoriamente',
      SUCCESFULL_DELETE_FILE: 'El archivo se elimino satisfactoriamente',
      ERROR_UPLOAD_FILE: 'Error al cargar el archivo',
      ERROR_VALIDATED_FILE: 'Error al validar el archivo',
      ERROR_PROCESS_FILE: 'Error al procesar el archivo',
    },
    MESSAGE_CONCILIATION: {
      SUCCESFULL_CONCILIATION: 'Se realizo la conciliación exitosamente.',
      ERROR_CONCILIATION: 'No se puede realizar la conciliación.',
      ERROR_OBTENER_CONCILIADOS: 'No se encuentran operaciones conciliadas',
      ERROR_OBTENER_CERTIFICADAS:
        'No se encuentran operaciones certificadas no conciliadas',
      ERROR_OBTENER_PROGRAMADAS:
        'No se encuentran operaciones programadas no conciliadas',
      ERROR_MODIFICACION: 'Error al realizar la modificación',
      MESSAGE_CIERRE_CONCILIACION: {
        SUCCESFULL_CIERRE_CONCILIACION:
          'Se realizo el cierre de conciliación exitosamente',
        ERROR_CIERRE_FECHA_CONCILIACION:
          'No se puede realizar el cierre de conciliación correctamente',
      },
    },
    MESSAGE_TRANSPORTE: {
      ERROR_TRANSPORTE: 'Error al consultar las transportadoras',
    },
    MESSAGE_BANCO: {
      ERROR_BANCO: 'Error al consultar los bancos',
    },
    MESSAGE_CIERRE_FECHA: {
      SUCCESFULL_CIERRE_FECHA: 'Se realizo el cierre de día exitosamente.',
      ERROR_CIERRE_FECHA:
        'No se puede realizar el cierre del día correctamente',
    },
    MESSAGE_CIERRE_PROG_PRELIMINAR: {
      SUCCESFULL_CIERRE_PRELIMINAR:
        'Se realizo el cierre de programación preliminar exitosamente',
      ERROR_CIERRE_FECHA_PRELIMINAR:
        'No se puede realizar el cierre de programación preliminar correctamente',
    },
    MESSAGE_CIERRE_PROG_DEFINITIVA: {
      SUCCESFULL_CIERRE_DEFINITIVA:
        'Se realizo el cierre de programación definitivo exitosamente',
      REABRIR_CIERRE: 'Se reabrio exitosamente',
      ERROR_CIERRE_FECHA_DEFINITIVA:
        'No se puede realizar el cierre de programación definitivo correctamente',
      ERROR_REABRIR_CIERRE: '',
    },
    MESSAGE_CIERRE_PROG_CERTIFICACION: {
      SUCCESFULL_CIERRE_CERTIFICACION:
        'Se realizo el cierre de certificación exitosamente',
      ERROR_CIERRE_FECHA_CERTIFICACION:
        'No se puede realizar el cierre de certificación correctamente',
    },
    MESSAGE_ADMIN_TIPO_CUNTAS: {
      ERROR_GET_TIPO_ADMIN_CUNTAS:
        'No se puedo obtener la lista de Tipos Cuentas correctamente',
      SUCCESFULL_PERSIST_ADMIN_TIPO_CUNTAS:
        'Se realizo el guardado de Tipo Cuenta exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CUNTAS:
        'No se puedo gurdar el Tipo Cuenta correctamente',
    },
    MESSAGE_ADMIN_CUNTAS_PUC: {
      ERROR_GET_TIPO_ADMIN_CUNTAS_PUC:
        'No se puedo obtener la lista de Cuentas Puc correctamente',
      SUCCESFULL_PERSIST_ADMIN_CUNTAS_PUC:
        'Se realizo el guardado de Cuenta Puc exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CUNTAS_PUC:
        'No se puedo gurdar el Cuenta Puc correctamente',
    },
    MESSAGE_ADMIN_CENTRO_CIUDAD: {
      ERROR_GET_TIPO_ADMIN_CENTRO_CIUDAD:
        'No se puedo obtener la lista de Centro Ciudades correctamente',
      SUCCESFULL_PERSIST_ADMIN_CENTRO_CIUDAD:
        'Se realizo el guardado de Centro Ciudades exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CENTRO_CIUDAD:
        'No se puedo gurdar el Centro Ciudades correctamente',
    },
    MESSAGE_ADMIN_CENTRO_COSTOS: {
      ERROR_GET_TIPO_ADMIN_CENTRO_COSTOS:
        'No se puedo obtener la lista de Centro Ciudades correctamente',
      SUCCESFULL_PERSIST_ADMIN_CENTRO_COSTOS:
        'Se realizo el guardado de Centro Ciudades exitosamente',
      ERROR_PERSIST_TIPO_ADMIN_CENTRO_COSTOS:
        'No se puedo gurdar el Centro Ciudades correctamente',
    },
    MESSAGE_CONTABILIDAD_PM: {
      SUCCESFULL_GENERATE_PM: 'Se realizo la contabilidad PM exitosamente',
      ERROR__GENERATE_PM:
        'No se puedo realizar la contabilidad PM correctamente',
    },
    MESSAGE_CONTABILIDAD_AM: {
      SUCCESFULL_GENERATE_AM: 'Se realizo la contabilidad AM exitosamente',
      ERROR__GENERATE_AM:
        'No se puedo realizar la contabilidad AM correctamente',
    },
    MESSAGE_CIERRE_CONTABILIDAD_PM: {
      SUCCESFULL_GENERATE_PM:
        'Se realizo el cierre de la contabilidad exitosamente',
    },
    MESSAGE_CIERRE_CONTABILIDAD_AM: {
      SUCCESFULL_GENERATE_AM:
        'Se realizo el cierre de la contabilidad AM exitosamente',
    },
    MESSAGE_GESTION_PUNTOS: {},
    MESSAGE_VLIDACION_FECHAS: {
      ERROR_DATE: 'La fecha inicial debe de ser menor a la fecha final',
      REQUIRED_RANGE_DATE: 'Se requiere seleccionar un rango de fechas'
    },
    MESSAGE_POLITICA_RETENCION: {
      SUCCESFULL_POLITICA_RETENCION: 'Se ejecuto la politica de retención exitosamente.',
    },
    SEARCH_VALIDATION: {
      EMPTY_FIELD_GENERAL: 'Se requiere seleccionar un valor',
    },
  },

  DIALOG_FORM: {
    SIZE_FORM: '90%',
  },

  DIALOG_CONFIG: {
    width: '90vw',
    maxWidth: '780px',
    height: 'auto',
    maxHeight: '80vh',
    autoFocus: false,
    disableClose: false,
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
      CARG_PRELIMINAR: 'CARG_PRELIMINAR',
      CARG_DEFINITICO: 'CARG_DEFINITICO',
      CONCILIACION: 'CONCILIACION',
    },

    ESTADO: {
      COMPLETO: 'COMPLETO',
      PROCESO: 'PROCESO',
    },
  },

  //Codigos para la ventana de alerta global
  CODE_EMERGENT: {
    ERROR: 1,
    WARNING: 2,
    SUCCESFULL: 3,
    ESPERAR: 4,
  },

  //Estados de conciliacion
  ESTADOS_CONCILIACION: {
    ESTADO_NO_CONCILIADO: 'NO_CONCILIADA',
  },

  //Codigos para el envio de tipo de archivos a cargar
  CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS: 'IPPSV',
  CARGUE_PRELIMINAR_PROGRAMACION_SERVICIOS_IPP: 'IPP',
  CARGUE_DEFINITIVO_PROGRAMACION_SERVICIOS: 'DEFIN',
  CARGUE_SERVICIOS_RECOLECCION_PROVICION: 'ISRPO',
  CARGUE_CERTIFICACION_PROGRAMACION_SERVICIOS: 'CERTI',

  //Tipo de punto
  TIPO_PUNTOS: {
    BANCO: 'BANCO',
    BAN_REP: 'BAN_REP',
    CAJERO: 'CAJERO',
    CLIENTE: 'CLIENTE',
    FONDO: 'FONDO',
    OFICINA: 'OFICINA',
  },

  NOMBRE_TIPO_BANREP: 'BANCO REPUBLICA-',

  TIPO_IDENTIFICACION: ['NIT', 'CC'],

  //Gestion Archvio
  PARAMETRO_GESTION: 'LIQCO'
};

//-----------------------------------------------------------------------------------------------------------------
// End_Points para consumo de servicios
//-----------------------------------------------------------------------------------------------------------------

export const URLs = {
  //Api
  //API_VERSION: '/v1.0.1/ade',

  STAGE: '/ade',

  //Cargue Archivos
  CARGUE_FILE: '/archivos',
  CARGUE_FILE_CONSULTAR: '/consultar',

  //Archivos cargados
  ARCHIVO_CARGADO: '/archivos-cargados',
  ARCHIVO_CARGADO_CONSULTA: '/consultar-page',
  CARGUE_ARCHIVO_GUARDAR: '/guardar',
  CARGUE_ARCHIVO_DESCARGAR: '/descargar-id',
  CARGUE_ARCHIVO_ELIMINAR: '/eliminar',
  CARGUE_ARCHIVO_REABRIR: '/reabrir',
  CONSULTAR_X_AGRUPADOR: '/consultar-agrupador',
  CARGUE_ID_ARCHIVO_DESCARGAR: '/descargar-idarchivo',

  //Programacion preliminar
  PROGRAMACION_PRELIMINAR: '/cargue-preliminar',
  PROGRAMACION_PRELIMINAR_VALIDAR: '/validar',
  PROGRAMACION_PRELIMINAR_PROCESAR: '/procesar',
  PROGRAMACION_PRELIMINAR_HISTORICO: '/detalle',
  PROGRAMACION_PRELIMINAR_CONSULTAR: '/consultar',
  PROGRAMACION_PRELIMINAR_CERRAR: 'cierre-preliminar',

  //Programacion definitiva
  PROGRAMACION_DEFINITIVA: '/cargue-definitivo',
  PROGRAMACION_DEFINITIVA_VALIDAR: '/validar',
  PROGRAMACION_DEFINITIVA_CONSULTAR: '/consultar',
  PROGRAMACION_DEFINITIVA_PROCESAR: '/procesar',
  PROGRAMACION_DEFINITIVA_HISTORICO: '/detalle',

  //Programacion certificación
  PROGRAMACION_CERTIFICACION: '/cargue-certificacion',
  PROGRAMACION_CERTIFICACION_VALIDAR: '/validar',
  PROGRAMACION_CERTIFICACION_CONSULTAR: '/consultar',
  PROGRAMACION_CERTIFICACION_CERTIFICACIONES: '/certificaciones',
  PROGRAMACION_CERTIFICACION_PROCESAR: '/procesar',
  PROGRAMACION_CERTIFICACION_HISTORICO: '/detalle',
  PROGRAMACION_CERTIFICACION_PROCESAR_ALCANCES: '/procesar-alcances',

  //Operaciones programadas
  OPERACIONES_PROGRAMADAS: '/operaciones-programadas',
  OPERACIONES_PROGRAMADAS_PROCESAR: '/procesar',
  OPERACIONES_PROGRAMADAS_REABRIR: '/reabrir',


  //Conciliación
  CONCILIACION: '/conciliacion',
  CONCILIACION_CONSULTA: '/consultar-conciliadas',
  OP_PROGRAMADAS_SIN_CONCILIAR: '/programadas-no-conciliadas',
  OP_CERTIFICADAS_SIN_CONCILIAR: '/certificadas-no-conciliadas',
  OP_RESUMEN: '/consultar/resumen',
  CONCILIACION_MANUAL: '/conciliacion-manual',
  CONCILIACION_RESUMEN: '/conciliacion/conciliacionmanual',
  DESCONCILIAR: 'desconciliaciones',
  ACTUALIZAR_OP_PROGRAMADAS: '/update-programadas-fallidas',
  ACTUALIZAR_OP_CERTIFICADAS: '/update-certificadas-fallidas',
  CONCILIACION_CIERRE: '/cierre',
  OP_PROGRAMADAS_FALLIDAS: "?estadoConciliacion=FALLIDA&estadoConciliacion=CANCELADA&estadoConciliacion=POSPUESTA&estadoConciliacion=FUERA_DE_CONCILIACION",
  UPDATE_ESTADO_PROGRAMADAS: "/update-estado-programadas",
  UPDATE_ESTADO_CERTIFICADAS: "/update-estado-certificadas",

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
  DOMINIOS: '/dominios',
  DOMINIO_CONSULTA: '/consultar',
  DOMINIO_CONSULTA_X_DOMINIO: '/consultarXDominio',
  DOMINIO_MAESTRO: '/dominios',
  DOMINIO_OBTENER: '/obtener',
  DOMINIOS_TODOS: '/obtener-todos',
  DOMINIO_CREAR: '/guardar',
  DOMINIO_ACTUALIZAR: '/actualizar',
  DIMINIO_CONSULTAR: '/consultar-dominio',
  DOMINIO_ELIMINAR: '/eliminar',

  //Listar clientes
  CLIENTE: '/clientes-corporativos',
  CLIENTE_CONSULTAR: '/consultar',

  //Generar Llaves
  LLAVES: '/encriptar',
  LLAVES_GENERAR: '/generar-llaves',

  //Consultar parametro
  PARAMETRO: '/parametro',
  PARAMETRO_CONSULTA: '/consultar',

  //Listar ciudades
  CIUDADES: '/ciudad',
  CIUDADES_CONSULTA: '/consultar',

  //Proceso diario
  PROCESO_DIARIO: '/proceso-diario',
  PROCESO_DIARIO_CONSULTAR: '/consultar-fecha-proceso',

  //Proceso diario
  VALIDA_ESTADO_PROCESO: '/auditoria-procesos',
  VALIDA_ESTADO_PROCESO_CONSULTAR: '/consultar-proceso',

  //Gestion puntos
  GESTION_PUNTOS: '/punto',
  DOMINIO_FUNCIONAL: '/dominio-funcional',
  CONSULTAR_DOMINIO: '/consultar-dominio',
  CONSULTAR_PUNTOS: '/consultar',
  GUARDAR_PUNTO: '/guardar',
  ACTUALIZAR_PUNTO: '/actualizar',
  GESTION_PUNTOS_TDV: '/puntos-codigo-tdv',

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

  //Administración tasas costo
  ADMIN_TASAS_COSTO: '/tasas-cambio',
  ADMIN_TASAS_COSTO_CONSULTAR: '/consultar',
  ADMIN_TASAS_COSTO_GUARDAR: '/guardar',
  ADMIN_TASAS_COSTO_ACTUALIZAR: '/actualizar',
  ADMIN_TASAS_COSTO_CONSULTAR_ID: '/consultar-id',

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
  ADMIN_CENTRO_CIUDAD_ELIMINAR: '/eliminar',
  ADMIN_CENTRO_CIUDAD_CONSULTAR_ID: '/consultar-id',
  ADMIN_CENTRO_CIUDAD_PPAL: '/ppal',

  //Admin configuracion contable entiudades
  ADMIN_CONF_CONTABLE_ENTIDADES: '/conf-contable-entidades',
  ADMIN_CONF_CONTABLE_ENTIDADES_CONSULTAR: '/consultar',
  ADMIN_CONF_CONTABLE_ENTIDADES_GUARDAR: '/guardar',
  ADMIN_CONF_CONTABLE_ENTIDADES_ACTUALIZAR: '/actualizar',

  //Cierre Contabilidad
  CIERRE_CONTABILIDAD: '/cierre-contabilidad',

  CIERRE_CONTABILIDAD_CERRAR: '/cerrar',

  //AUTORIZACION_CONTABILIDAD
  AUTORIZACION_CIERRE_CONTABILIDAD: '/autorizacioncierre',
  AUTORIZACION_CONTABILIDAD: '/autorizacion',

  //Generar Contabilidad
  CONTABILIDAD: '/contabilidad',
  CONTABILIDAD_GENERAL: '/generar',
  CONTABILIDAD_GENERAR_ARCHIVO: '/archivo-cierre',

  // generar archivos contabilidad
  GENERAR_ARCHIVO: '/generararchivo',
  GENERAR: '/generar',

  //Coatos Flete Charter
  COSTOS_FLETE_CHARTER: '/costos-flete-charter',
  COSTOS_FLETE_CHARTER_CONSULTAR: '/consultar',
  COSTOS_FLETE_CHARTER_GUARDAR: '/grabar',

  //Liuidar costos
  LIQUIDACION: '/liquidar-valores',
  LIQUIDACION_COSTOS: '/costos',
  CONSULTAR_COSTOS: '/consultar',
  ERRORES_COSTOS: '/errores-costos',
  ERRORES_COSTOS_CONSULTAR: '/consultar',

  //Tarifas Operacion
  TARIFAS_OPERACION: '/tarifas-operacion',
  TARIFAS_OPERACION_GUARDAR: '/guardar',
  TARIFAS_OPERACION_ACTUALIZAR: '/actualizar',
  TARIFAS_OPERACION_ELIMINAR: '/eliminar',
  TARIFAS_OPERACION_CONSULTAR: '/consultar',

  //Administración menu-rol
  ADMIN_MENU_ROL: '/menurol',
  ADMIN_MENU_ROL_CONSULTAR: '/consultar',
  ADMIN_MENU_ROL_GUARDAR: '/guardar',
  ADMIN_MENU_ROL_ACTUALIZAR: '/actualizar',

  //Administración festivos-nacionles
  ADMIN_FESTIVOS_NACIONALES: '/festivos-nacionales',
  ADMIN_FESTIVOS_NACIONALES_CONSULTAR: '/consultar',
  ADMIN_FESTIVOS_NACIONALES_GUARDAR: '/guardar',
  ADMIN_FESTIVOS_NACIONALES_ELIMINAR: '/eliminar',

  //Administración usuario
  ADMIN_USUARIO: '/usuario',
  ADMIN_USUARIO_CONSULTAR: '/consultar',
  ADMIN_USUARIO_GUARDAR: '/guardar',
  ADMIN_USUARIO_ACTUALIZAR: '/actualizar',

  //Administración rol
  ADMIN_ROL: '/rol',
  ADMIN_ROL_CONSULTAR: '/consultar',
  ADMIN_ROL_GUARDAR: '/guardar',
  ADMIN_ROL_ACTUALIZAR: '/actualizar',

  //Escalas
  ADMIN_ESCALAS: '/escalas',
  ADMIN_ESCALAS_CONSULTAR: '/consultar',
  ADMIN_ESCALAS_GUARDAR: '/guardar',
  ADMIN_ESCALAS_ACTUALIZAR: '/actualizar',

  //Escalas
  ADMIN_AUDITORIA: '/auditoria-login',
  ADMIN_AUDITORIA_GUARDAR: '/guardar',

  //Puntos Codigos TDV
  PUNTOS_CODIGO: '/puntos-codigo-tdv',
  PUNTOS_CODIGO_CONSULTAR: '/consultar',
  PUNTOS_CODIGO_GUARDAR: '/guardar',
  PUNTOS_CODIGO_ACTUALIZAR: '/actualizar',

  //Liquidacion mensual
  LIQUIDACION_MENSUAL: '/clasificacion-mensual',
  LIQUIDACION_MENSUAL_CONSULTAR: '/consultar',
  LIQUIDACION_MENSUAL_GUARDAR: '/guardar',
  LIQUIDACION_MENSUAL_LIQUIDAR: '/liquidar',
  LIQUIDACION_MENSUAL_CIERRE: '/cerrar',

  //Denominacion Cantidad
  DENOMINACION_CANTIDAD: '/tdv-denomin-cantidad',
  DENOMINACION_CANTIDAD_CONSULTAR: '/consultar',
  DENOMINACION_CANTIDAD_GUARDAR: '/guardar',
  DENOMINACION_CANTIDAD_ACTUALIZAR: '/actualizar',

  //funciones Dinamicas
  FUNCIONES_DINAMICAS: '/funciones-dinamicas',
  FUNCIONES_DINAMICAS_CONSULTAR: '/consultar',
  FUNCIONES_DINAMICAS_EJECUTAR: '/ejecutar',
  FUNCIONES_DINAMICAS_ACTUALIZAR: '/actualizar',

  //Conciliacion Costos
  ARCHIVOS_PENDIENTE_CARGA_CONSULTA: '/archivos-liquidacion/consultar',
  ARCHIVOS_PENDIENTE_CARGA_PROCESAR: '/archivos-liquidacion/procesar',
  ARCHIVOS_PENDIENTE_CARGA_DETALLE_PROCESAR: '/archivos-liquidacion/detalle',
  ARCHIVOS_PENDIENTE_CARGA_DETALLE_ERROR_PROCESAR: '/archivos-liquidacion/detalle-error',
  ARCHIVOS_PENDIENTE_CARGA_ELIMINAR: '/archivos-liquidacion/eliminar',
  ARCHIVOS_PENDIENTE_CARGA_DESCARGAR: '/descargar-idArchivo-liquidacion',

  //Conciliacion Transporte
  CONCILIACION_TRANSPORTE_CONSULTAR_CONCILIADAS: '/conciliacion-transporte/consultar-conciliadas',
  CONCILIACION_TRANSPORTE_CONSULTAR_COBRADAS_NO_IDENTIFICADAS: '/conciliacion-transporte/remitidas-no-identificadas',
  CONCILIACION_TRANSPORTE_DESCONCILIAR: '/conciliacion-transporte/desconciliar',
  CONCILIACION_TRANSPORTE_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS: '/conciliacion-transporte/identificadas-con-diferencias',
  CONCILIACION_TRANSPORTE_ACEPTADO_RECHAZADO_IDENTIFICADAS_CON_DIFERENCIA: '/conciliacion-transporte/identificadas-con-diferencia-aceptar-rechazar',
  CONCILIACION_TRANSPORTE_ACEPTAR_RECHAZAR: '/conciliacion-transporte/remitidas-aceptar-rechazar',
  CONCILIACION_TRANSPORTE_CONSULTAR_LIQUIDADAS_NO_COBRADAS: '/conciliacion-transporte/liquidadas-no-cobradas',
  CONCILIACION_TRANSPORTE_ELIMINAR_RECHAZAR_LQUIDADAS_NO_COBRADAS: '/conciliacion-transporte/liquidadas-eliminar-rechazar',
  CONCILIACION_TRANSPORTE_CONSULTAR_REGISTROS_ELIMINADOS: '/conciliacion-transporte/eliminadas',
  CONCILIACION_TRANSPORTE_ELIMINADAS_REINTEGRAR: '/conciliacion-transporte/liquidadas-reintegrar',

  //Conciliacion Procesamiento
  CONCILIACION_PROCESAMIENTO_CONSULTAR_CONCILIADAS: '/conciliacion-procesamiento/consultar-conciliadas',
  CONCILIACION_PROCESAMIENTO_DESCONCILIAR: '/conciliacion-procesamiento/desconciliar',
  CONCILIACION_PROCESAMIENTO_CONSULTAR_COBRADAS_NO_IDENTIFICADAS: '/conciliacion-procesamiento/remitidas-no-identificadas',
  CONCILIACION_PROCESAMIENTO_COBRADAS_NO_IDENTIFICADAS_ACEPTAR_RECHAZAR: '/conciliacion-procesamiento/remitidas-aceptar-rechazar',
  CONCILIACION_PROCESAMIENTO_CONSULTAR_LIQUIDADAS_NO_COBRADAS: '/conciliacion-procesamiento/liquidadas-no-cobradas',
  CONCILIACION_PROCESAMIENTO_LIQUIDADAS_NO_COBRADAS_ELIMINAR_RECHAZAR: '/conciliacion-procesamiento/liquidadas-eliminar-rechazar',
  CONCILIACION_PROCESAMIENTO_CONSULTAR_IDENTIFICADAS_CON_DIFERENCIAS: '/conciliacion-procesamiento/identificadas-con-diferencias',
  CONCILIACION_PROCESAMIENTO_IDENTIFICADAS_CON_DIFERENCIAS_ACEPTAR_RECHAZAR: '/conciliacion-procesamiento/identificadas-con-diferencia-aceptar-rechazar',
  CONCILIACION_PROCESAMIENTO_CONSULTAR_ELIMINADAS: '/conciliacion-procesamiento/eliminadas',
  CONCILIACION_PROCESAMIENTO_ELIMINADAS_REINTEGRAR: '/conciliacion-procesamiento/liquidadas-reintegrar',

  //Gestion de archivos
  GESTION_ARCHIVOS_CONSULTAR: '/gestion-archivos-liquidacion/consultar-agrupador',
  GESTION_ARCHIVOS_DESCARGAR: '/archivos/descargar-gestion-archivos-liquidacion',
  GESTION_ARCHIVOS_CERRAR: '/gestion-archivos-liquidacion/aceptar-archivos',

  //Generar Politica
  GENERAR_POLITICA: '/gestion-retencion-archivos/eliminar',
};

export const ROLES = [
  { code: 'ROL_1', description: 'Descripcion Rol' },
  { code: 'ROL_2', description: 'Descripcion Rol' },
  { code: 'ROL_3', description: 'Descripcion Rol' },
  { code: 'ROL_4', description: 'Descripcion Rol' },
  { code: 'ROL_5', description: 'Descripcion Rol' }
];
