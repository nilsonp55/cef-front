import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { CargueProgramacionComponent } from './pages/modules/cargue-programacion/cargue-programacion.component';
import { ConciliacionComponent } from './pages/modules/conciliacion/conciliacion.component';
import { ContabilizacionComponent } from './pages/modules/contabilizacion/contabilizacion.component';
import { LiquidacionComponent } from './pages/modules/liquidacion/liquidacion.component';
import { AdministracionComponent } from './pages/modules/administracion/administracion.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BannerSuperiorComponent } from './pages/shared/components/banner-superior/banner-superior.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { FooterComponent } from './pages/shared/components/footer/footer.component';
import { TablaConciliacion } from './pages/shared/components/tabla-conciliacion/tabla-conciliacion.component';
import { MatStepperModule } from '@angular/material/stepper';
import { DialogResultValidacionComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-result-validacion/dialog-result-validacion.component';
import { VentanaEmergenteResponseComponent } from './pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { LogArchivosCargadosComponent } from './pages/shared/components/program-preliminar/historico-archivos-cargados/log-archivos-cargados/log-archivos-cargados.component';
import { HistoricoArchivosCargadosComponent } from './pages/shared/components/program-preliminar/historico-archivos-cargados/historico-archivos-cargados.component';
import { DialogValidarArchivoComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-validar-archivo/dialog-validar-archivo.component';
import { ArchivosCargadosComponent } from './pages/shared/components/program-preliminar/archivos-cargados/archivos-cargados.component';
import { CarguePreliminarComponent } from './pages/modules/cargue-programacion/cargue-preliminar/cargue-preliminar.component';
import { CargueDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/cargue-definitivo.component';
import { OperacionesConciliadasComponent } from './pages/modules/conciliacion/operaciones-conciliadas/operaciones-conciliadas.component';
import { OperacionesNoConciliadasComponent } from './pages/modules/conciliacion/operaciones-no-conciliadas/operaciones-no-conciliadas.component';
import { OperacionesFallidasComponent } from './pages/modules/conciliacion/operaciones-fallidas/operaciones-fallidas.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DialogDesconciliarComponent } from './pages/modules/conciliacion/operaciones-conciliadas/dialog-desconciliar/dialog-desconciliar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './pages/shared/components/spinner/spinner.component';
import { ArchivosCargadosDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/archivos-cargados-definitivo/archivos-cargados-definitivo.component';
import { HistoricoArchivosCargadosDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/historico-archivos-cargados-definitivo.component';
import { LogArchivoCargadoDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/log-archivo-cargado-definitivo/log-archivo-cargado.component';
import { DialogInfoProgramadasNoConciliadasComponent } from './pages/modules/conciliacion/operaciones-no-conciliadas/dialog-info-programadas-no-conciliadas/dialog-info-programadas-no-conciliadas.component';
import { DialogInfoCertificadasNoConciliadasComponent } from './pages/modules/conciliacion/operaciones-no-conciliadas/dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import { DialogConciliacionManualComponent } from './pages/modules/conciliacion/operaciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { ResumenComponent } from './pages/modules/conciliacion/consulta-operaciones/resumen/resumen.component';
import { DialogInfoProgramadasFallidasComponent } from './pages/modules/conciliacion/operaciones-fallidas/dialog-info-programadas-fallidas/dialog-info-programadas-fallidas.component';
import { ConsultaOperaConciliadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-conciliadas/consulta-opera-conciliadas.component';
import { ConsultaOperaProgramadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-programadas/consulta-opera-programadas.component';
import { ConsultaOperaCertificadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-certificadas/consulta-opera-certificadas.component';
import { ConsultaOperaFallidasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-fallidas/consulta-opera-fallidas.component';
import { CargueCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-certificacion.component';
import { CargueDefinitivoCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/cargue-definitivo-certificacion.component';
import { LogArchivosCargadosCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/histori-archi-carga-certifi/log-cargados-certificacion/log-certificacion.component';
import { DialogResultValidacionCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/archi-carga-certificacion/result-validacion-certificacion/result-validacion.component';
import { HistoriArchiCargaCertifiComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/histori-archi-carga-certifi/histori-archi-carga-certifi.component';
import { ArchiCargaCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/archi-carga-certificacion/archi-carga-certificacion.component';
import { AdministracionContabilidadComponent } from './pages/modules/administracion/administracion-contabilidad/administracion-contabilidad.component';
import { AdministradorCuentasPucComponent } from './pages/modules/administracion/administrador-cuentas-puc/administrador-cuentas-puc.component';
import { AdministradorTipoCentroCostosComponent } from './pages/modules/administracion/administrador-tipo-centro-costos/administrador-tipo-centro-costos.component';
import { CentroCiudadBaseComponent } from './pages/modules/administracion/centro-ciudad-base/centro-ciudad-base.component'; 
import { AdministracionCentroCiudadesComponent } from './pages/modules/administracion/administracion-centro-ciudades/administracion-centro-ciudades.component';
import { CentroCiudadPrincipalComponent } from './pages/modules/administracion/centro-ciudad-principal/centro-ciudad-principal.component';
import { AdministracionConfContableEntidadComponent } from './pages/modules/administracion/administracion-conf-contable-entidad/administracion-conf-contable-entidad.component';
import { CierreFechaComponent } from './pages/modules/administracion/cierre-fecha/cierre-fecha.component';
import { ResultadoContabilidadComponent } from './pages/modules/contabilizacion/resultado-contabilidad/resultado-contabilidad.component';
import { MenuContabilidadComponent } from './pages/modules/contabilizacion/menu-contabilidad/menu-contabilidad.component';
import { DialogConfirmEjecutarComponentComponent } from './pages/modules/contabilizacion/dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { CierreProgramacionPreliminarComponent } from './pages/modules/cargue-programacion/cierre-programacion-preliminar/cierre-programacion-preliminar.component';
import { ContabilidadBaseComponent } from './pages/modules/contabilizacion/contabilidad-base/contabilidad-base.component';
import { ContabilidadPmComponent } from './pages/modules/contabilizacion/contabilidad-pm/contabilidad-pm.component';
import { ContabilidadAmComponent } from './pages/modules/contabilizacion/contabilidad-am/contabilidad-am.component';
import { AdministracionDominiosComponent } from './pages/modules/administracion/administracion-dominios/administracion-dominios.component';
import { DialogEliminarIdentificadorComponent } from './pages/modules/administracion/administracion-dominios/dialog-eliminar-identificador/dialog-eliminar-identificador.component';
import { DialogIdentificadorDominioComponent } from './pages/modules/administracion/administracion-dominios/dialog-identificador-dominio/dialog-identificador-dominio.component';
import { DialogTablaDominioComponent } from './pages/modules/administracion/administracion-dominios/dialog-tabla-dominio/dialog-tabla-dominio.component';
import { GestionPuntosComponent } from './pages/modules/administracion/gestion-puntos/gestion-puntos.component';
import { CrearPuntoComponent } from './pages/modules/administracion/gestion-puntos/crear-punto/crear-punto.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CierreProgramacionDefinitivaComponent } from './pages/modules/cargue-programacion/cierre-programacion-definitiva/cierre-programacion-definitiva.component';
import { FiltroBancoTdvComponent } from './pages/shared/components/filtro-banco-tdv/filtro-banco-tdv.component';
import { GenerarContabilidadAmComponent } from './pages/modules/contabilizacion/generar-contabilidad-am/generar-contabilidad-am.component';
import { GenerarContabilidadPmComponent } from './pages/modules/contabilizacion/generar-contabilidad-pm/generar-contabilidad-pm.component';
import { DialogInfoOpProgramadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-fallidas/dialog-info-op-programadas/dialog-info-op-programadas.component';
import { DialogActualizarOpCertificadasComponent } from './pages/modules/conciliacion/operaciones-fallidas/dialog-actualizar-op-certificadas/dialog-actualizar-op-certificadas.component';
import { CierreConciliacionComponent } from './pages/modules/conciliacion/cierre-conciliacion/cierre-conciliacion.component';
import { CierreCertificacionComponent } from './pages/modules/cargue-certificacion/cierre-certificacion/cierre-certificacion.component';
import { DialogVerArchivoComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-ver-archivo/dialog-ver-archivo.component';
import { DialogVerArchivoDefiComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/dialog-ver-archivo-defi/dialog-ver-archivo-defi.component';
import { DialogResultValidacionComponentComponent } from './pages/modules/cargue-programacion/cargue-definitivo/archivos-cargados-definitivo/dialog-result-validacion-component/dialog-result-validacion-component.component';
import { DialogVerArchDefiComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/dialog-ver-arch-defi/dialog-ver-arch-defi.component';
import { ErroresContabilidadComponent } from './pages/modules/contabilizacion/errores-contabilidad/errores-contabilidad.component';
import { ResultadoValoresLiquidadosComponent } from './pages/modules/liquidacion/liquida-costos/resultado-valores-liquidados/resultado-valores-liquidados.component';
import { GestionRolesUsuariosComponent } from './pages/modules/administracion/gestion-roles-usuarios/gestion-roles-usuarios.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { LiquidaCostosComponent } from './pages/modules/liquidacion/liquida-costos/liquida-costos.component';
import { CostosServicioCharterComponent } from './pages/modules/liquidacion/costos-servicio-charter/costos-servicio-charter.component';
import { ErroresCostosComponent } from './pages/modules/liquidacion/liquida-costos/errores-costos/errores-costos.component';
import { InitAppComponent } from './pages/shared/components/init-app/init-app.component';
import { TarifasOperacionComponent } from './pages/modules/liquidacion/tarifas-operacion/tarifas-operacion.component';
import { EscalasComponent } from './pages/modules/liquidacion/escalas/escalas.component';
import { PuntosCodigoTdvComponent } from './pages/modules/administracion/puntos-codigo-tdv/puntos-codigo-tdv.component';
import { FormCodigoTdvComponent } from './pages/modules/administracion/puntos-codigo-tdv/form-codigo-tdv.component';
import { TableCodigoTdvComponent } from './pages/modules/administracion/puntos-codigo-tdv/table-codigo-tdv.component';
import { LiquidacionMensualComponent } from './pages/modules/liquidacion/liquidacion-mensual/liquidacion-mensual.component';
import { DetalleGuardarLiquidacionComponent } from './pages/modules/liquidacion/liquidacion-mensual/detalle-guardar-liquidacion/detalle-guardar-liquidacion.component';
import { GuardarLiquidacionComponent } from './pages/modules/liquidacion/liquidacion-mensual/guardar-liquidacion/guardar-liquidacion.component';
import { TdvDenominacionCantidadComponent } from './pages/modules/liquidacion/tdv-denominacion-cantidad/tdv-denominacion-cantidad.component';
import { GestionUsuariosComponent } from './pages/modules/administracion/gestion-usuarios/gestion-usuarios.component';
import { GestionProcedimientosComponent } from './pages/modules/administracion/gestion-procedimientos/gestion-procedimientos.component';
import { EjecutarProcedimientoComponent } from './pages/modules/administracion/gestion-procedimientos/ejecutar-procedimiento/ejecutar-procedimiento.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CierreLiquidacionMensualComponent } from './pages/modules/liquidacion/cierre-liquidacion-mensual/cierre-liquidacion-mensual.component';
import { AdministracionFestivosNacionalesComponent } from './pages/modules/administracion/administracion-festivos-nacionales/administracion-festivos-nacionales.component';
import { GenerarLlaveArchivosComponent } from './pages/modules/administracion/generar-llave-archivos/generar-llave-archivos.component';
import { DialogConfirmLlavesComponent } from './pages/modules/administracion/generar-llave-archivos/dialog-confirm-llaves/dialog-confirm-llaves.component';
import { CierreSesionComponent } from './pages/cierre-sesion/cierre-sesion.component';
import { AdministracionTasasCambioComponent } from './pages/modules/administracion/administracion-tasas-cambio/administracion-tasas-cambio.component';
import { ProcesarAlcancesComponent } from './pages/modules/cargue-certificacion/procesar-alcances/procesar-alcances.component';
import { ClientesCorporativosComponent } from './pages/modules/administracion/clientes-corporativos/clientes-corporativos.component';
import { FormClientesCorpComponent } from './pages/modules/administracion/clientes-corporativos/form-clientes-corp/form-clientes-corp.component';
import { ConciliacionCostosComponent } from './pages/modules/conciliacion-costos/conciliacion-costos.component';
import { FiltroArchivosComponent } from './pages/shared/components/filtro-archivos/filtro-archivos.component';
import { ArchivosPendienteCargaComponent } from './pages/modules/conciliacion-costos/archivos-pendientes-carga/archivos-pendientes-carga.component';
import { VentanaEmergenteVerDetalleArchivoComponent } from './pages/modules/conciliacion-costos/archivos-pendientes-carga/ventana-emergente-detalle/ventana-emergente-detalle';
import { VentanaEmergenteErrorComponent } from './pages/modules/conciliacion-costos/archivos-pendientes-carga/ventana-emergente-error/ventana-emergente-error.component';
import { VentanaEmergenteEliminarComponent } from './pages/modules/conciliacion-costos/archivos-pendientes-carga/ventana-emergente-eliminar/ventana-emergente-eliminar.component';
import { FiltroConciliacionTransporteComponent } from './pages/shared/components/filtro-conciliacion-transporte/filtro-conciliacion-transporte.component';
import { ConciliacionTransporteComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/conciliacion-transporte.component';
import { ConciliadasComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/conciliadas/conciliadas.component';
import { CobradasTdvNoIdentificadasComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/cobradas-tdv-no-identificadas/cobradas-tdv-no-identificadas.component';
import { LiquidadasNoCobradasTdvComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/liquidadas-no-cobradas-tdv/liquidadas-no-cobradas-tdv.component';
import { IdentificadasConDiferenciaComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/identificadas-con-diferencia/identificadas-con-diferencia.component';
import {MatTabsModule} from '@angular/material/tabs';
import { VentanaEmergenteDesconciliarComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/conciliadas/ventana-emergente-desconciliar/ventana-emergente-desconciliar.component';
import { VentanaEmergenteAceptarRechazarComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/cobradas-tdv-no-identificadas/ventana-emergente-aceptar-rechazar/ventana-emergente-aceptar-rechazar.component';
import { VentanaEmergenteAceptarRechazarIdentificadasConDifComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/identificadas-con-diferencia/ventana-emergente-aceptar-rechazar/ventana-emergente-aceptar-rechazar.component';
/*Procesamiento */
import { ConciliacionProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/conciliacion-procesamiento.component';
import { TablaConciliacionProcesamiento } from './pages/shared/components/tabla-conciliacion-procesamiento/tabla-conciliacion-procesamiento.component';
import { ConciliadasProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/conciliadas-procesamiento/conciliadas-porcesamiento.component';
import { VentanaEmergenteProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/ventana-emergente-procesamiento/ventana-emergente-procesamiento.component';
import { CobradasTdvNoIdentificadasProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/cobradas-tdv-no-identificadas-procesamineto/cobradas-tdv-no-identificadas-procesamiento.component';
import { LiquidadasNoCobradasTdvComponentProcesamiento } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/liquidadas-no-cobradas-tdv-procesamiento/liquidadas-no-cobradas-tdv-procesamiento.component';
import { IdentificadasConDiferenciaProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/identificadas-con-diferencia-procesamiento/identificadas-con-diferencia-procesamiento.component';
import { RegistroEliminadosProcesamientoComponent } from './pages/modules/conciliacion-costos/conciliacion-procesamiento/registros-eliminados-procesamiento/registros-eliminados-procesamiento.component';
import { VentanaEmergenteEliminarRechazarTComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/liquidadas-no-cobradas-tdv/ventana-emergente-eliminar-rechazar-t/ventana-emergente-eliminar-rechazar-t.component';
import { RegistrosEliminadosComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/registros-eliminados/registros-eliminados.component';
import { GestionArchivosComponent } from './pages/modules/conciliacion-costos/gestion-archivos/gestion-archivos.component';
import { VentanaEmergenteDetalleGestionComponent } from './pages/modules/conciliacion-costos/gestion-archivos/ventana-emergente-detalle-gestion/ventana-emergente-detalle-gestion';
import { VentanaEmergenteEliminarGestionComponent } from './pages/modules/conciliacion-costos/gestion-archivos/ventana-emergente-eliminar-gestion/ventana-emergente-eliminar-gestion.component';
import { VentanaEmergenteReintegrarRegistrosComponent } from './pages/modules/conciliacion-costos/conciliacion-transporte/registros-eliminados/ventana-emergente-reintegrar-registros/ventana-emergente-reintegrar-registros.component';
import { DialogUpdateEstadoOperacionesComponent } from './pages/modules/conciliacion/operaciones-fallidas/dialog-update-estado-operaciones/dialog-update-estado-operaciones.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { AuthInterceptor } from './_service/auth.interceptor';
import { GenerarPoliticaRetencionComponent } from './pages/modules/administracion/generar-politica-retencion/generar-politica-retencion.component';
import { DialogConfirmPoliticaComponent } from './pages/modules/administracion/generar-politica-retencion/dialog-confirm-politica/dialog-confirm-politica.component';
import { TarifasOperacionTablaComponent } from './pages/modules/liquidacion/tarifas-operacion/tarifas-operacion-tabla.component';
import { TarifasOperacionFormComponent } from './pages/modules/liquidacion/tarifas-operacion/tarifas-operacion-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CargueProgramacionComponent,
    ConciliacionComponent,
    ContabilizacionComponent,
    LiquidacionComponent,
    AdministracionComponent,
    FooterComponent,
    BannerSuperiorComponent,
    LogArchivosCargadosComponent,
    HistoricoArchivosCargadosComponent,
    DialogValidarArchivoComponent,
    DialogResultValidacionComponent,
    VentanaEmergenteResponseComponent,
    ArchivosCargadosComponent,
    CarguePreliminarComponent,
    CargueDefinitivoComponent,
    OperacionesConciliadasComponent,
    OperacionesNoConciliadasComponent,
    OperacionesFallidasComponent,
    CierreFechaComponent,
    DialogDesconciliarComponent,
    SpinnerComponent,
    ArchivosCargadosDefinitivoComponent,
    HistoricoArchivosCargadosDefinitivoComponent,
    LogArchivoCargadoDefinitivoComponent,
    DialogInfoProgramadasNoConciliadasComponent,
    DialogInfoCertificadasNoConciliadasComponent,
    DialogConciliacionManualComponent,
    ResumenComponent,
    DialogInfoProgramadasFallidasComponent,
    ConsultaOperaConciliadasComponent,
    ConsultaOperaProgramadasComponent,
    ConsultaOperaCertificadasComponent,
    ConsultaOperaFallidasComponent,
    CargueCertificacionComponent,
    CargueDefinitivoCertificacionComponent,
    LogArchivosCargadosCertificacionComponent,
    DialogResultValidacionCertificacionComponent,
    HistoriArchiCargaCertifiComponent,
    ArchiCargaCertificacionComponent,
    AdministracionContabilidadComponent,
    AdministradorCuentasPucComponent,
    AdministradorTipoCentroCostosComponent,
    CentroCiudadBaseComponent,
    AdministracionCentroCiudadesComponent,
    CentroCiudadPrincipalComponent,
    AdministracionConfContableEntidadComponent,
    CierreFechaComponent,
    ResultadoContabilidadComponent,
    MenuContabilidadComponent,
    CierreProgramacionPreliminarComponent,
    DialogConfirmEjecutarComponentComponent,
    ContabilidadBaseComponent,
    ContabilidadPmComponent,
    ContabilidadAmComponent,
    AdministracionDominiosComponent,
    DialogEliminarIdentificadorComponent,
    DialogIdentificadorDominioComponent,
    DialogTablaDominioComponent,
    GestionPuntosComponent,
    CrearPuntoComponent,
    GenerarContabilidadAmComponent,
    GenerarContabilidadPmComponent,
    CierreProgramacionDefinitivaComponent,
    DialogInfoOpProgramadasComponent,
    DialogActualizarOpCertificadasComponent,
    FiltroBancoTdvComponent,
    DialogTablaDominioComponent,
    DialogIdentificadorDominioComponent,
    DialogEliminarIdentificadorComponent,
    CierreConciliacionComponent,
    DialogVerArchivoComponent,
    CierreCertificacionComponent,
    DialogVerArchivoDefiComponent,
    DialogResultValidacionComponent,
    DialogResultValidacionComponentComponent,
    DialogVerArchDefiComponent,
    ErroresContabilidadComponent,
    LiquidacionComponent,
    ResultadoValoresLiquidadosComponent,
    GestionRolesUsuariosComponent,
    LiquidaCostosComponent,
    CostosServicioCharterComponent,
    ErroresCostosComponent,
    InitAppComponent,
    TarifasOperacionComponent,
    EscalasComponent,
    PuntosCodigoTdvComponent,
    FormCodigoTdvComponent,
    TableCodigoTdvComponent,
    LiquidacionMensualComponent,
    DetalleGuardarLiquidacionComponent,
    GuardarLiquidacionComponent,
    TdvDenominacionCantidadComponent,
    GestionUsuariosComponent,
    GestionProcedimientosComponent,
    EjecutarProcedimientoComponent,
    CierreLiquidacionMensualComponent,
    AdministracionFestivosNacionalesComponent,
    GenerarLlaveArchivosComponent,
    DialogConfirmLlavesComponent,
    CierreSesionComponent,
    AdministracionTasasCambioComponent,
    ProcesarAlcancesComponent,
    ClientesCorporativosComponent,
    FormClientesCorpComponent,
    ConciliacionCostosComponent,
    ArchivosPendienteCargaComponent,
    FiltroArchivosComponent,
    VentanaEmergenteVerDetalleArchivoComponent,
    VentanaEmergenteErrorComponent,
    VentanaEmergenteEliminarComponent,
    FiltroConciliacionTransporteComponent,
    TablaConciliacion,
    ConciliacionTransporteComponent,
    ConciliadasComponent,
    CobradasTdvNoIdentificadasComponent,
    LiquidadasNoCobradasTdvComponent,
    IdentificadasConDiferenciaComponent,
    VentanaEmergenteDesconciliarComponent,
    VentanaEmergenteAceptarRechazarComponent,
    ConciliacionProcesamientoComponent,
    TablaConciliacionProcesamiento,
    ConciliadasProcesamientoComponent,
    VentanaEmergenteProcesamientoComponent,
    CobradasTdvNoIdentificadasProcesamientoComponent,
    LiquidadasNoCobradasTdvComponentProcesamiento,
    IdentificadasConDiferenciaProcesamientoComponent,
    RegistroEliminadosProcesamientoComponent,
    VentanaEmergenteAceptarRechazarIdentificadasConDifComponent,
    VentanaEmergenteEliminarRechazarTComponent,
    RegistrosEliminadosComponent,
    GestionArchivosComponent,
    VentanaEmergenteDetalleGestionComponent,
    VentanaEmergenteEliminarGestionComponent,
    VentanaEmergenteReintegrarRegistrosComponent,
    DialogUpdateEstadoOperacionesComponent,
    GenerarPoliticaRetencionComponent,
    DialogConfirmPoliticaComponent,
    TarifasOperacionTablaComponent,
    TarifasOperacionFormComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    CommonModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatCardModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTableExporterModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatExpansionModule,
  ],
  providers: [
    DatePipe,
    MatDatepickerModule,
    SpinnerComponent,
    FiltroBancoTdvComponent,
    CurrencyPipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
