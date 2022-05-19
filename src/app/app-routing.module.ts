import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { AdministracionComponent } from './pages/modules/administracion/administracion.component';
import { CargueDefinitivoComponent } from './pages/modules/cargue-programacion/cargue-definitivo/cargue-definitivo.component';
import { CargueInicialComponent } from './pages/modules/cargue-programacion/cargue-inicial/cargue-inicial.component';
import { CarguePreliminarComponent } from './pages/modules/cargue-programacion/cargue-preliminar/cargue-preliminar.component';
import { CargueProgramacionComponent } from './pages/modules/cargue-programacion/cargue-programacion.component';
import { CierreFechaComponent } from './pages/modules/cierre-fecha/cierre-fecha.component';
import { ConciliacionComponent } from './pages/modules/conciliacion/conciliacion.component';
import { OpearcionesConciliadasComponent } from './pages/modules/conciliacion/opearciones-conciliadas/opearciones-conciliadas.component';
import { OpearcionesFallidasComponent } from './pages/modules/conciliacion/opearciones-fallidas/opearciones-fallidas.component';
import { OpearcionesNoConciliadasComponent } from './pages/modules/conciliacion/opearciones-no-conciliadas/opearciones-no-conciliadas.component';
import { ResumenComponent } from './pages/modules/conciliacion/consulta-operaciones/resumen/resumen.component';
import { CargueCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-certificacion.component';
import { CargueDefinitivoCertificacionComponent } from './pages/modules/cargue-certificacion/cargue-definitivo-certificacion/cargue-definitivo-certificacion.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'cargue-programacion', component: CargueProgramacionComponent, children: [
      { path: 'cargue-inicial', component: CargueInicialComponent },
      { path: 'administrador-cargue-preliminar', component: CarguePreliminarComponent },
      { path: 'administrador-cargue-definitivo', component: CargueDefinitivoComponent },
    ]
  },
  {
    path: 'cargue-certificacion', component: CargueCertificacionComponent, children: [
      { path: 'cargue-inicial', component: CargueInicialComponent },
      { path: 'gestion-cargue-certificacion', component: CargueDefinitivoCertificacionComponent },
    ]
  },
  {
    path: 'conciliacion', component: ConciliacionComponent, children: [
      { path: 'operaciones-conciliadas', component: OpearcionesConciliadasComponent },
      { path: 'operaciones-programadas-no-conciliadas', component: OpearcionesNoConciliadasComponent },
      { path: 'operaciones-sin-conciliar', component: OpearcionesFallidasComponent },
      { path: 'resumen-operaciones', component: ResumenComponent }
    ]
  },
  { path: 'administracion', component: AdministracionComponent },
  { path: 'cierre-fecha', component: CierreFechaComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
