import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule} from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { CargueProgramacionComponent } from './pages/modules/cargue-programacion/cargue-programacion.component';
import { ConciliacionComponent } from './pages/modules/conciliacion/conciliacion.component';
import { ContabilizacionComponent } from './pages/modules/contabilizacion/contabilizacion.component';
import { LiquidacionComponent } from './pages/modules/liquidacion/liquidacion.component';
import { AdministracionComponent } from './pages/modules/administracion/administracion.component';
import { CargueInicialComponent } from './pages/modules/cargue-programacion/cargue-inicial/cargue-inicial.component';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import { BannerSupeiorComponent } from './pages/shared/components/banner-supeior/banner-supeior.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import { FooterComponent } from './pages/shared/components/footer/footer.component';
import { MatStepperModule} from '@angular/material/stepper';
import { DialogResultValidacionComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-result-validacion/dialog-result-validacion.component';
import { VentanaEmergenteResponseComponent } from './pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { LogArchivosCargadosComponent } from './pages/shared/components/program-preliminar/historico-archivos-cargados/log-archivos-cargados/log-archivos-cargados.component';
import { HistoricoArchivosCargadosComponent } from './pages/shared/components/program-preliminar/historico-archivos-cargados/historico-archivos-cargados.component';
import { DialogValidarArchivoComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-validar-archivo/dialog-validar-archivo.component';
import { ArchivosCargadosComponent } from './pages/shared/components/program-preliminar/archivos-cargados/archivos-cargados.component';
import { CargaArchivosComponent } from './pages/shared/components/carga-archivos/carga-archivos.component';
import { CarguePreliminarComponent } from './pages/modules/cargue-programacion/cargue-preliminar/cargue-preliminar.component';
import { CargueDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/cargue-definitivo.component';
import { OpearcionesConciliadasComponent } from './pages/modules/conciliacion/opearciones-conciliadas/opearciones-conciliadas.component';
import { OpearcionesNoConciliadasComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/opearciones-no-conciliadas.component';
import { OpearcionesFallidasComponent } from './pages/modules/conciliacion/opearciones-fallidas/opearciones-fallidas.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { DialogDesconciliarComponent } from './pages/modules/conciliacion/opearciones-conciliadas/dialog-desconciliar/dialog-desconciliar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerComponent } from './pages/shared/components/spinner/spinner.component';
import { ArchivosCargadosDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/archivos-cargados-definitivo/archivos-cargados-definitivo.component';
import { HistoricoArchivosCargadosDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/historico-archivos-cargados-definitivo.component';
import { LogArchivoCargadoDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/log-archivo-cargado-definitivo/log-archivo-cargado.component';
import { DialogInfoProgramadasNoConciliadasComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/dialog-info-programadas-no-conciliadas/dialog-info-programadas-no-conciliadas.component';
import { DialogInfoCertificadasNoConciliadasComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/dialog-info-certificadas-no-conciliadas/dialog-info-certificadas-no-conciliadas.component';
import { DialogConciliacionManualComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/dialog-conciliacion-manual/dialog-conciliacion-manual.component';
import { ResumenComponent } from './pages/modules/conciliacion/consulta-operaciones/resumen/resumen.component';
import { DialogInfoProgramadasFallidasComponent } from './pages/modules/conciliacion/opearciones-fallidas/dialog-info-programadas-fallidas/dialog-info-programadas-fallidas.component';
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
import { AdministracionCentroCiudadesComponent } from './pages/modules/administracion/administracion-centro-ciudades/administracion-centro-ciudades.component';
import { AdministracionConfContableEntidadComponent } from './pages/modules/administracion/administracion-conf-contable-entidad/administracion-conf-contable-entidad.component';
import { CierreFechaComponent } from './pages/modules/administracion/cierre-fecha/cierre-fecha.component';
import { ResultadoContabilidadComponent } from './pages/modules/contabilizacion/resultado-contabilidad/resultado-contabilidad.component';
import { MenuContabilidadComponent } from './pages/modules/contabilizacion/menu-contabilidad/menu-contabilidad.component';
import { DialogConfirmEjecutarComponentComponent } from './pages/modules/contabilizacion/dialog-confirm-ejecutar-component/dialog-confirm-ejecutar-component.component';
import { CierreProgramacionPreliminarComponent } from './pages/modules/cargue-programacion/cierre-programacion-preliminar/cierre-programacion-preliminar.component';
import { ContabilidadPmComponent } from './pages/modules/contabilizacion/contabilidad-pm/contabilidad-pm.component';
import { ContabilidadAmComponent } from './pages/modules/contabilizacion/contabilidad-am/contabilidad-am.component';
import { AdministracionDominiosComponent } from './pages/modules/administracion/administracion-dominios/administracion-dominios.component';
import { DialogEliminarIdentificadorComponent } from './pages/modules/administracion/administracion-dominios/dialog-eliminar-identificador/dialog-eliminar-identificador.component';
import { DialogIdentificadorDominioComponent } from './pages/modules/administracion/administracion-dominios/dialog-identificador-dominio/dialog-identificador-dominio.component';
import { DialogTablaDominioComponent } from './pages/modules/administracion/administracion-dominios/dialog-tabla-dominio/dialog-tabla-dominio.component';
import { GestionPuntosComponent } from './pages/modules/administracion/gestion-puntos/gestion-puntos.component';
import { ModificarPuntoComponent } from './pages/modules/administracion/gestion-puntos/modificar-punto/modificar-punto.component';
import { CrearPuntoComponent } from './pages/modules/administracion/gestion-puntos/crear-punto/crear-punto.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CierreProgramacionDefinitivaComponent } from './pages/modules/cargue-programacion/cierre-programacion-definitiva/cierre-programacion-definitiva.component';
import { FiltroBancoTdvComponent } from './pages/shared/components/filtro-banco-tdv/filtro-banco-tdv.component';
import { GenerarContabilidadAmComponent } from './pages/modules/contabilizacion/generar-contabilidad-am/generar-contabilidad-am.component';
import { GenerarContabilidadPmComponent } from './pages/modules/contabilizacion/generar-contabilidad-pm/generar-contabilidad-pm.component';
import { DialogInfoOpProgramadasComponent } from './pages/modules/conciliacion/consulta-operaciones/consulta-opera-fallidas/dialog-info-op-programadas/dialog-info-op-programadas.component';
import { DialogActualizarOpCertificadasComponent } from './pages/modules/conciliacion/opearciones-fallidas/dialog-actualizar-op-certificadas/dialog-actualizar-op-certificadas.component';
import { CierreConciliacionComponent } from './pages/modules/conciliacion/cierre-conciliacion/cierre-conciliacion.component';
import { CierreCertificacionComponent } from './pages/modules/cargue-certificacion/cierre-certificacion/cierre-certificacion.component';
import { DialogVerArchivoComponent } from './pages/shared/components/program-preliminar/archivos-cargados/dialog-ver-archivo/dialog-ver-archivo.component';
import { DialogVerArchivoDefiComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/dialog-ver-archivo-defi/dialog-ver-archivo-defi.component';
import { DialogResultValidacionComponentComponent } from './pages/modules/cargue-programacion/cargue-definitivo/archivos-cargados-definitivo/dialog-result-validacion-component/dialog-result-validacion-component.component';
import { DialogVerArchDefiComponent } from './pages/modules/cargue-programacion/cargue-definitivo/historico-archivos-cargados-definitivo/dialog-ver-arch-defi/dialog-ver-arch-defi.component';
import { ErroresContabilidadComponent } from './pages/modules/contabilizacion/errores-contabilidad/errores-contabilidad.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { ResultadoValoresLiquidadosComponent } from './pages/modules/liquidacion/liquida-costos/resultado-valores-liquidados/resultado-valores-liquidados.component';
import { LiquidaCostosComponent } from './pages/modules/liquidacion/liquida-costos/liquida-costos.component';
import { CostosServicioCharterComponent } from './pages/modules/liquidacion/costos-servicio-charter/costos-servicio-charter.component';
import { ErroresCostosComponent } from './pages/modules/liquidacion/liquida-costos/errores-costos/errores-costos.component';
import { InitAppComponent } from './pages/shared/components/init-app/init-app.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    CargueProgramacionComponent,
    ConciliacionComponent,
    ContabilizacionComponent,
    LiquidacionComponent,
    AdministracionComponent,
    CargueInicialComponent,
    FooterComponent,
    BannerSupeiorComponent,
    LogArchivosCargadosComponent,
    HistoricoArchivosCargadosComponent,
    DialogValidarArchivoComponent,
    DialogResultValidacionComponent,
    VentanaEmergenteResponseComponent,
    ArchivosCargadosComponent,
    CargaArchivosComponent,
    CarguePreliminarComponent,
    CargueDefinitivoComponent,
    OpearcionesConciliadasComponent,
    OpearcionesNoConciliadasComponent,
    OpearcionesFallidasComponent,
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
    AdministracionCentroCiudadesComponent,
    AdministracionConfContableEntidadComponent,
    CierreFechaComponent,
    ResultadoContabilidadComponent,
    MenuContabilidadComponent,
    CierreProgramacionPreliminarComponent,
    DialogConfirmEjecutarComponentComponent,
    ContabilidadPmComponent,
    ContabilidadAmComponent,
    AdministracionDominiosComponent,
    DialogEliminarIdentificadorComponent,
    DialogIdentificadorDominioComponent,
    DialogTablaDominioComponent,
    GestionPuntosComponent,
    ModificarPuntoComponent,
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
    LiquidaCostosComponent,
    CostosServicioCharterComponent,
    ErroresCostosComponent,
    InitAppComponent,
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
    MatSelectModule,
    MatCheckboxModule,
    MatTableExporterModule,
    ],
  providers: [DatePipe, MatDatepickerModule, SpinnerComponent, FiltroBancoTdvComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
