import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AdministracionComponent } from './pages/modules/administracion/administracion.component';
import { CargueDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/cargue-definitivo.component';
import { CarguePreliminarComponent } from './pages/modules/cargue-programacion/cargue-preliminar/cargue-preliminar.component';
import { CargueProgramacionComponent } from './pages/modules/cargue-programacion/cargue-programacion.component';
import { ConciliacionComponent } from './pages/modules/conciliacion/conciliacion.component';
import { OperacionesConciliadasComponent } from './pages/modules/conciliacion/operaciones-conciliadas/operaciones-conciliadas.component';
import { OperacionesFallidasComponent } from './pages/modules/conciliacion/operaciones-fallidas/operaciones-fallidas.component';
import { OperacionesNoConciliadasComponent } from './pages/modules/conciliacion/operaciones-no-conciliadas/operaciones-no-conciliadas.component';
import { ResumenComponent } from './pages/modules/conciliacion/consulta-operaciones/resumen/resumen.component';
import { CargueCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-certificacion.component';
import { CargueDefinitivoCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/cargue-definitivo-certificacion.component';
import { ProcesarAlcancesComponent } from './pages/modules/cargue-certificacion/procesar-alcances/procesar-alcances.component';
import { CierreFechaComponent } from './pages/modules/administracion/cierre-fecha/cierre-fecha.component';
import { AdministracionContabilidadComponent } from './pages/modules/administracion/administracion-contabilidad/administracion-contabilidad.component';
import { AdministradorCuentasPucComponent } from './pages/modules/administracion/administrador-cuentas-puc/administrador-cuentas-puc.component';
import { AdministradorTipoCentroCostosComponent } from './pages/modules/administracion/administrador-tipo-centro-costos/administrador-tipo-centro-costos.component';
import { AdministracionCentroCiudadesComponent } from './pages/modules/administracion/administracion-centro-ciudades/administracion-centro-ciudades.component';
import { CentroCiudadPrincipalComponent } from './pages/modules/administracion/centro-ciudad-principal/centro-ciudad-principal.component';
import { ContabilizacionComponent } from './pages/modules/contabilizacion/contabilizacion.component';
import { CierreProgramacionPreliminarComponent } from './pages/modules/cargue-programacion/cierre-programacion-preliminar/cierre-programacion-preliminar.component';
import { ContabilidadPmComponent } from './pages/modules/contabilizacion/contabilidad-pm/contabilidad-pm.component';
import { AdministracionDominiosComponent } from './pages/modules/administracion/administracion-dominios/administracion-dominios.component';
import { ContabilidadAmComponent } from './pages/modules/contabilizacion/contabilidad-am/contabilidad-am.component';
import { GestionPuntosComponent } from './pages/modules/administracion/gestion-puntos/gestion-puntos.component';
import { GenerarContabilidadAmComponent } from './pages/modules/contabilizacion/generar-contabilidad-am/generar-contabilidad-am.component';
import { GenerarContabilidadPmComponent } from './pages/modules/contabilizacion/generar-contabilidad-pm/generar-contabilidad-pm.component';
import { CierreProgramacionDefinitivaComponent } from './pages/modules/cargue-programacion/cierre-programacion-definitiva/cierre-programacion-definitiva.component';
import { ConsultaOperaConciliadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-conciliadas/consulta-opera-conciliadas.component';
import { ConsultaOperaProgramadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-programadas/consulta-opera-programadas.component';
import { ConsultaOperaCertificadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-certificadas/consulta-opera-certificadas.component';
import { ConsultaOperaFallidasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-fallidas/consulta-opera-fallidas.component';
import { CierreConciliacionComponent } from './pages/modules/conciliacion/cierre-conciliacion/cierre-conciliacion.component';
import { CierreCertificacionComponent } from './pages/modules/cargue-certificacion/cierre-certificacion/cierre-certificacion.component';
import { LiquidacionComponent } from './pages/modules/liquidacion/liquidacion.component';
import { GestionRolesUsuariosComponent } from './pages/modules/administracion/gestion-roles-usuarios/gestion-roles-usuarios.component';
import { LiquidaCostosComponent } from './pages/modules/liquidacion/liquida-costos/liquida-costos.component';
import { CostosServicioCharterComponent } from './pages/modules/liquidacion/costos-servicio-charter/costos-servicio-charter.component';
import { AdministracionConfContableEntidadComponent } from './pages/modules/administracion/administracion-conf-contable-entidad/administracion-conf-contable-entidad.component';
import { InitAppComponent } from './pages/shared/components/init-app/init-app.component';
import { TarifasOperacionComponent } from './pages/modules/liquidacion/tarifas-operacion/tarifas-operacion.component';
import { PuntosCodigoTdvComponent } from './pages/modules/administracion/puntos-codigo-tdv/puntos-codigo-tdv.component';
import { EscalasComponent } from './pages/modules/liquidacion/escalas/escalas.component';
import { LiquidacionMensualComponent } from './pages/modules/liquidacion/liquidacion-mensual/liquidacion-mensual.component';
import { DetalleGuardarLiquidacionComponent } from './pages/modules/liquidacion/liquidacion-mensual/detalle-guardar-liquidacion/detalle-guardar-liquidacion.component';
import { GestionUsuariosComponent } from './pages/modules/administracion/gestion-usuarios/gestion-usuarios.component';
import { TdvDenominacionCantidadComponent } from './pages/modules/liquidacion/tdv-denominacion-cantidad/tdv-denominacion-cantidad.component';
import { GestionProcedimientosComponent } from './pages/modules/administracion/gestion-procedimientos/gestion-procedimientos.component';
import { CierreLiquidacionMensualComponent } from './pages/modules/liquidacion/cierre-liquidacion-mensual/cierre-liquidacion-mensual.component';
import { AdministracionFestivosNacionalesComponent } from './pages/modules/administracion/administracion-festivos-nacionales/administracion-festivos-nacionales.component';
import { LiquidacionCharterGuard } from './wards/liquidacion-charter.guard';
import { LiquidacionCostosGuard } from './wards/liquidacion-costos.guard';
import { LiquidacionTarifasOperacionGuard } from './wards/liquidacion-tarifas-operacion.guard';
import { AdministracionCodigoTdvGuard } from './wards/administracion-codigo-tdv.guard';
import { LiquidacionLiquidacionMensualGuard } from './wards/liquidacion-liquida-mensual.guard';
import { LiquidacionDenominacionCantidadGuard } from './wards/liquidacion-denominacion-cant.guard';
import { LiquidacionCierreLiquidacionMensualGuard } from './wards/liquidacion-cierre-liquida-mensual.guard';
import { AdministracionDominiosGuard } from './wards/administracion-dominios.guard';
import { AdministracionPuntosGuard } from './wards/administracion-puntos.guard';
import { AdministracionCierreFechaGuard } from './wards/administracion-cierre-fecha.guard';
import { AdministracionTipoCuentasGuard } from './wards/administracion-tipo-cuentas.guard';
import { LiquidacionCuentasPucGuard } from './wards/liquidacion-cuentas-puc.guard';
import { AdministracionTipoCentroCostosGuard } from './wards/liquidacion-tipo-centro-costos.guard';
import { AdministracionCentroCiudadGuard } from './wards/administracion-centro-ciudad.guard';
import { CentroCiudadPpalGuard } from './wards/centro-ciudad-ppal.guard';
import { AdministracionConfEntiContablesGuard } from './wards/administracion-conf-enti-contables.guard';
import { AdministracionRolesGuard } from './wards/administracion-roles.guard';
import { AdministracionUsuariosGuard } from './wards/administracion-usuarios.guard';
import { AdministracionProcedimientosGuard } from './wards/administracion-procedimientos.guard';
import { AdministracionFestivosNacionalesGuard } from './wards/administracion-festivos-nacionales.guard';
import { ContabilidadCierreAmGuard } from './wards/contabilidad-cierre-am.guard';
import { ContabilidadGenerarAmGuard } from './wards/contabilidad-generar-am.guard';
import { ContabilidadCierrePmGuard } from './wards/contabilidad-cierre-pm.guard';
import { ContabilidadGenerarPmGuard } from './wards/contabilidad-generar-pm.guard';
import { CertificacionGestionCargueCertificacionGuard } from './wards/certificacion-gestion-cargue-certifi.guard';
import { CertificacionCierreCertificacionGuard } from './wards/certificacioncierreCertificacion.guard';
import { PreliminarGestionCargueGuard } from './wards/preliminar-gestionCargue.guard';
import { PreliminarCierreCarguePreliminarGuard } from './wards/preliminar-cierreCarguePreliminar.guard';
import { PreliminarGestionCargueDefinitivoGuard } from './wards/preliminar-gestionCargueDefinitivo.guard';
import { PreliminarCierreCargueDefinitivoGuard } from './wards/preliminar-cierreCargueDefinitivo.guard';
import { GenerarLlaveArchivosComponent } from './pages/modules/administracion/generar-llave-archivos/generar-llave-archivos.component';
import { CierreSesionComponent } from './pages/cierre-sesion/cierre-sesion.component';
import { AdministracionTasasCambioComponent } from './pages/modules/administracion/administracion-tasas-cambio/administracion-tasas-cambio.component';
import { ClientesCorporativosComponent } from './pages/modules/administracion/clientes-corporativos/clientes-corporativos.component';
import { ClientesCorporativosGuard } from './wards/clientes-corporativos.guard';
import { ConciliacionCostosComponent } from './pages/modules/conciliacion-costos/conciliacion-costos.component';
import { ArchivosPendienteCargaComponent } from './pages/modules/conciliacion-costos/archivos-pendientes-carga/archivos-pendientes-carga.component';
import { ArchivosPendientesCargaGuard } from './wards/archivos-pendientes-carga.guard';
import { ConciliacionTransporteGuard } from './wards/conciliacion-transporte.guard';
import { ConciliacionTransporteComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/conciliacion-transporte.component';
import { ConciliacionProcesamientoGuard } from './wards/conciliacion-procesamiento.guard';
import { ConciliacionProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/conciliacion-procesamiento.component';
import { GestionArchivosGuard } from './wards/gestion-archivos.guard';
import { GestionArchivosComponent } from './pages/modules/conciliacion-costos/gestion-archivos/gestion-archivos.component';
import { GenerarPoliticaRetencionComponent } from './pages/modules/administracion/generar-politica-retencion/generar-politica-retencion.component';

const routes: Routes = [
  { path: '', component: InitAppComponent },
  { path: 'home', component: HomeComponent },
  { path: 'final-session', component: CierreSesionComponent },
  {
    path: 'cargue-programacion', component: CargueProgramacionComponent, children: [
      { path: 'administrador-cargue-preliminar', component: CarguePreliminarComponent, canActivate: [PreliminarGestionCargueGuard] },
      { path: 'administrador-cierre-preliminar', component: CierreProgramacionPreliminarComponent, canActivate: [PreliminarCierreCarguePreliminarGuard] },
      { path: 'administrador-cargue-definitivo', component: CargueDefinitivoComponent, canActivate: [PreliminarGestionCargueDefinitivoGuard] },
      { path: 'administrador-cierre-definitivo', component: CierreProgramacionDefinitivaComponent, canActivate: [PreliminarCierreCargueDefinitivoGuard] },
    ]
  },
  {
    path: 'cargue-certificacion', component: CargueCertificacionComponent, children: [
      { path: 'gestion-cargue-certificacion', component: CargueDefinitivoCertificacionComponent, canActivate: [CertificacionGestionCargueCertificacionGuard] },
      { path: 'administrador-cargue-certificacion', component: CierreCertificacionComponent, canActivate: [CertificacionCierreCertificacionGuard] },
      { path: 'procesar-alcances', component: ProcesarAlcancesComponent, canActivate: [CertificacionCierreCertificacionGuard] },
    ]
  },
  {
    path: 'conciliacion', component: ConciliacionComponent, children: [
      { path: 'operaciones-conciliadas-consulta', component: ConsultaOperaConciliadasComponent },
      { path: 'operaciones-programadas-no-conciliadas-consulta', component: ConsultaOperaProgramadasComponent },
      { path: 'operaciones-certificadas-no-conciliadas-consulta', component: ConsultaOperaCertificadasComponent },
      { path: 'operaciones-conciliadas-fallidas-consulta', component: ConsultaOperaFallidasComponent },
      { path: 'operaciones-conciliadas', component: OperacionesConciliadasComponent },
      { path: 'operaciones-programadas-no-conciliadas', component: OperacionesNoConciliadasComponent },
      { path: 'operaciones-sin-conciliar', component: OperacionesFallidasComponent },
      { path: 'resumen-operaciones', component: ResumenComponent },
      { path: 'administrador-cargue-conciliacion', component: CierreConciliacionComponent },
    ]
  },
  {
    path: 'contabilidad', component: ContabilizacionComponent, children: [
      { path: 'cierre-contabilidad-pm', component: ContabilidadPmComponent, canActivate: [ContabilidadCierrePmGuard] },
      { path: 'generar-contabilidad-pm', component: GenerarContabilidadPmComponent, canActivate: [ContabilidadGenerarPmGuard] },
      { path: 'cierre-contabilidad-am', component: ContabilidadAmComponent, canActivate: [ContabilidadCierreAmGuard] },
      { path: 'generar-contabilidad-am', component: GenerarContabilidadAmComponent, canActivate: [ContabilidadGenerarAmGuard] },
    ]
  },
  {
    path: 'liquidacion', component: LiquidacionComponent, children: [
      { path: 'servicio-charter', component: CostosServicioCharterComponent, canActivate: [LiquidacionCharterGuard] },
      { path: 'liquidar-costos', component: LiquidaCostosComponent, canActivate: [LiquidacionCostosGuard] },
      { path: 'tarifas-operacion', component: TarifasOperacionComponent, canActivate: [LiquidacionTarifasOperacionGuard] },
      { path: 'escala', component: EscalasComponent, canActivate: [LiquidacionCostosGuard] },
      { path: 'liquidacion-mensual', component: LiquidacionMensualComponent, canActivate: [LiquidacionLiquidacionMensualGuard] },
      { path: 'guardar-detalle-liquidacion/:fechaSistema/:codTransportadora', component: DetalleGuardarLiquidacionComponent },
      { path: 'tdv-denominacion-cantidad', component: TdvDenominacionCantidadComponent, canActivate: [LiquidacionDenominacionCantidadGuard] },
      { path: 'cierre-liquidacion-mensual', component: CierreLiquidacionMensualComponent, canActivate: [LiquidacionCierreLiquidacionMensualGuard] },
    ]
  },
  {
    path: 'cierre-fecha', component: CierreFechaComponent
  },
  {
    path: 'conciliacion-costos', component: ConciliacionCostosComponent, children: [
      { path: 'archivos-pendiente-carga', component: ArchivosPendienteCargaComponent, canActivate: [ArchivosPendientesCargaGuard] },
      { path: 'conciliacion-transporte', component: ConciliacionTransporteComponent, canActivate: [ConciliacionTransporteGuard] },
      { path: 'conciliacion-procesamiento', component: ConciliacionProcesamientoComponent, canActivate: [ConciliacionProcesamientoGuard] },
      { path: 'gestion-archivos', component: GestionArchivosComponent, canActivate: [GestionArchivosGuard] }
    ]
  },
  {
    path: 'administracion', component: AdministracionComponent, children: [
      { path: 'administracion-dominios', component: AdministracionDominiosComponent, canActivate: [AdministracionDominiosGuard] },
      { path: 'administracion-puntos', component: GestionPuntosComponent, canActivate: [AdministracionPuntosGuard] },
      { path: 'administracion-cierre-fecha', component: CierreFechaComponent, canActivate: [AdministracionCierreFechaGuard] },
      { path: 'administracion-tipo-cuentas', component: AdministracionContabilidadComponent, canActivate: [AdministracionTipoCuentasGuard] },
      { path: 'administracion-cuentas-puc', component: AdministradorCuentasPucComponent, canActivate: [LiquidacionCuentasPucGuard] },
      { path: 'administracion-tipo-centro-costos', component: AdministradorTipoCentroCostosComponent, canActivate: [AdministracionTipoCentroCostosGuard] },
      { path: 'administracion-centro-ciudad', component: AdministracionCentroCiudadesComponent, canActivate: [AdministracionCentroCiudadGuard] },
      { path: 'centro-ciudad-ppal', component: CentroCiudadPrincipalComponent, canActivate: [CentroCiudadPpalGuard]},
      { path: 'administracion-conf-contable-entidad', component: AdministracionConfContableEntidadComponent, canActivate: [AdministracionConfEntiContablesGuard] },
      { path: 'administracion-roles', component: GestionRolesUsuariosComponent, canActivate: [AdministracionRolesGuard] },
      { path: 'administracion-usuarios', component: GestionUsuariosComponent, canActivate: [AdministracionUsuariosGuard] },
      { path: 'administracion-procedimientos', component: GestionProcedimientosComponent, canActivate: [AdministracionProcedimientosGuard] },
      { path: 'administracion-festivos-nacionales', component: AdministracionFestivosNacionalesComponent, canActivate: [AdministracionFestivosNacionalesGuard] },
      { path: 'administracion-generar-llaves', component: GenerarLlaveArchivosComponent},
      { path: 'administracion-tasas-cambio', component: AdministracionTasasCambioComponent},
      { path: 'administracion-generar-politica', component: GenerarPoliticaRetencionComponent},
      { path: 'puntos-codigo-tdv', component: PuntosCodigoTdvComponent, canActivate: [AdministracionCodigoTdvGuard] },
      { path: 'clientes-corporativos', component: ClientesCorporativosComponent, canActivate: [ClientesCorporativosGuard] }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
