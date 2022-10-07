import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdministracionComponent } from './pages/modules/administracion/administracion.component';
import { CargueDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/cargue-definitivo.component';
import { CargueInicialComponent } from './pages/modules/cargue-programacion/cargue-inicial/cargue-inicial.component';
import { CarguePreliminarComponent } from './pages/modules/cargue-programacion/cargue-preliminar/cargue-preliminar.component';
import { CargueProgramacionComponent } from './pages/modules/cargue-programacion/cargue-programacion.component';
import { ConciliacionComponent } from './pages/modules/conciliacion/conciliacion.component';
import { OpearcionesConciliadasComponent } from './pages/modules/conciliacion/opearciones-conciliadas/opearciones-conciliadas.component';
import { OpearcionesFallidasComponent } from './pages/modules/conciliacion/opearciones-fallidas/opearciones-fallidas.component';
import { OpearcionesNoConciliadasComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/opearciones-no-conciliadas.component';
import { ResumenComponent } from './pages/modules/conciliacion/consulta-operaciones/resumen/resumen.component';
import { CargueCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-certificacion.component';
import { CargueDefinitivoCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/cargue-definitivo-certificacion.component';
import { CierreFechaComponent } from './pages/modules/administracion/cierre-fecha/cierre-fecha.component';
import { AdministracionContabilidadComponent } from './pages/modules/administracion/administracion-contabilidad/administracion-contabilidad.component';
import { AdministradorCuentasPucComponent } from './pages/modules/administracion/administrador-cuentas-puc/administrador-cuentas-puc.component';
import { AdministradorTipoCentroCostosComponent } from './pages/modules/administracion/administrador-tipo-centro-costos/administrador-tipo-centro-costos.component';
import { AdministracionCentroCiudadesComponent } from './pages/modules/administracion/administracion-centro-ciudades/administracion-centro-ciudades.component';
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
import { LiquidaCostosComponent } from './pages/modules/liquidacion/liquida-costos/liquida-costos.component';
import { CostosServicioCharterComponent } from './pages/modules/liquidacion/costos-servicio-charter/costos-servicio-charter.component';
import { AdministracionConfContableEntidadComponent } from './pages/modules/administracion/administracion-conf-contable-entidad/administracion-conf-contable-entidad.component';
import { InitAppComponent } from './pages/shared/components/init-app/init-app.component';


const routes: Routes = [
  //{ path: '', component: LoginComponent },
  { path: '', component: InitAppComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'cargue-programacion', component: CargueProgramacionComponent, children: [
      { path: 'cargue-inicial', component: CargueInicialComponent },
      { path: 'administrador-cargue-preliminar', component: CarguePreliminarComponent },
      { path: 'administrador-cierre-preliminar', component: CierreProgramacionPreliminarComponent },
      { path: 'administrador-cargue-definitivo', component: CargueDefinitivoComponent },
      { path: 'administrador-cierre-definitivo', component: CierreProgramacionDefinitivaComponent },
    ]
  },
  {
    path: 'cargue-certificacion', component: CargueCertificacionComponent, children: [
      { path: 'cargue-inicial', component: CargueInicialComponent },
      { path: 'gestion-cargue-certificacion', component: CargueDefinitivoCertificacionComponent },
      { path: 'administrador-cargue-certificacion', component: CierreCertificacionComponent },
    ]
  },
  {
    path: 'conciliacion', component: ConciliacionComponent, children: [
      { path: 'operaciones-conciliadas-consulta', component: ConsultaOperaConciliadasComponent },
      { path: 'operaciones-programadas-no-conciliadas-consulta', component: ConsultaOperaProgramadasComponent },
      { path: 'operaciones-certificadas-no-conciliadas-consulta', component: ConsultaOperaCertificadasComponent },
      { path: 'operaciones-conciliadas-fallidas-consulta', component: ConsultaOperaFallidasComponent },
      { path: 'operaciones-conciliadas', component: OpearcionesConciliadasComponent },
      { path: 'operaciones-programadas-no-conciliadas', component: OpearcionesNoConciliadasComponent },
      { path: 'operaciones-sin-conciliar', component: OpearcionesFallidasComponent },
      { path: 'resumen-operaciones', component: ResumenComponent },
      { path: 'administrador-cargue-conciliacion', component: CierreConciliacionComponent },
    ]
  },
  {
    path: 'contabilidad', component: ContabilizacionComponent, children: [
      { path: 'cierre-contabilidad-pm', component: ContabilidadPmComponent },
      { path: 'generar-contabilidad-pm', component: GenerarContabilidadPmComponent },
      { path: 'cierre-contabilidad-am', component: ContabilidadAmComponent },
      { path: 'generar-contabilidad-am', component: GenerarContabilidadAmComponent },
    ]
  },
  {
    path: 'liquidacion', component: LiquidacionComponent, children: [
      { path: 'servicio-charter', component: CostosServicioCharterComponent },
      { path: 'liquidar-costos', component: LiquidaCostosComponent },
    ]
  },
  {
    path: 'cierre-fecha', component: CierreFechaComponent
  },
  {
    path: 'administracion', component: AdministracionComponent, children: [
      { path: 'administracion-dominios', component: AdministracionDominiosComponent },
      { path: 'administracion-puntos', component: GestionPuntosComponent },
      { path: 'administracion-cierre-fecha', component: CierreFechaComponent },
      { path: 'administracion-tipo-cuentas', component: AdministracionContabilidadComponent },
      { path: 'administracion-cuentas-puc', component: AdministradorCuentasPucComponent },
      { path: 'administracion-tipo-centro-costos', component: AdministradorTipoCentroCostosComponent },
      { path: 'administracion-centro-ciudad', component: AdministracionCentroCiudadesComponent },
      { path: 'administracion-conf-contable-entidad', component: AdministracionConfContableEntidadComponent },
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
