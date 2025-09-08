import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { GeneralesService } from 'src/app/_service/generales.service';
import { TarifasEspecialesService } from 'src/app/_service/liquidacion-service/tarifas-especiales.service';
import { TarifasEspecialesClientesModel } from 'src/app/_model/liquidacion/tarifas-especiales-clientes.model'
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { AdicionarEditarTarifaEspecialComponent } from './adicionar-editar-tarifa-especial/adicionar-editar-tarifa-especial.component';
import { GestionPuntosService } from 'src/app/_service/gestion-puntos-service/gestionPuntos.service';

@Component({
  selector: 'app-tarifas-especiales',
  templateUrl: './tarifas-especiales.component.html',
  styleUrls: ['./tarifas-especiales.component.css']

})
export class TarifasEspecialesComponent implements OnInit {

  form: FormGroup;
  bancos: any[] = [];
  filtroBancoSelect: any;
  numeroDocumento: any;
  tipoDocumentoSelect: any;
  nombreCliente: any;
  codigoCliente: number;
  codigoPunto: number;
  nombrePunto: string;
  codigoCiudad: string;
  nombreCiudad: string;
  paginaTarifas: number;
  tamanoTarifas: number;
  buscar: boolean = false;
  ciudades: any[] = [];
  tipoOperaciones: any[] = [];
  tipoServicios: any[] = [];
  comisionesAplicar: any[] = [];
  unidadCobro: any[] = [];
  aplicaA: any[] = [];
  filtroAplicaASelect: any;
  cantidadRegistros: any;
  dataSourceTarifasEspeciales = new MatTableDataSource<any>([]);
  displayedColumnsTarifasEspeciales: string[] = ['select', 'nombreBanco', 'nombreTransportadora', 'nombreCiudad', 'tipoOperacion', 'tipoServicio', 'tipoComision', 'escala', 'nombrePunto', 'billetes', 'monedas', 'fajado', 'valorTarifa', 'codigoCliente', 'limiteComisionAplicar', 'valorComisionAdicional', 'fechaInicioVigencia', 'fechaFinVigencia', 'estado', 'acciones'];
  tipoDocumentos: any;
  clientes: any;
  dataTarifasPuntoArray: any[] = [];
  dataTarifasPunto: MatTableDataSource<TarifasEspecialesClientesModel>
  displayedColumnsTarifasPunto: string[] = ['select'
    , 'tipoOperacionTarifaEspecial'
    , 'tipoServicioTarifaEspecial'
    , 'tipoComisionTarifaEspecial'
    , 'unidadCobroTarifaEspecial'
    , 'valorComisionTarifaEspecial'
    , 'fechaInicioVigenciaTarifaEspecial'
    , 'fechaFinVigenciaTarifaEspecial'
    , 'estadoTaridaEspecial'
    , 'acciones'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sortTarifas: MatSort;
  /*
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataTarifasPunto.sort) {
        this.dataTarifasPunto.sort = sort;
    }
  }
    */
  nombrePuntos: any;
  tipoOperacion: any;
  tipoComision: any;
  codigoPuntos: any;
  codigoPuntoSelect: any;
  ciudadSelect: any;
  nombrePuntoSelect: any;
  tipoOperacionSelect: any;
  tipoComisionSelect: any;
  filtrosClientes: boolean;
  mostrarPrincipal: boolean = true;
  mostrarTarifas: boolean = false;
  modificarTarifas: boolean = false;
  dialogoTarifas: boolean = false;
  esEdicion: boolean = false;
  forReadOnly = true;
  idTarifaEspecial: number;
  selection = new SelectionModel<TarifasEspecialesClientesModel>(true, []);
  seleccionadosTarifas: any = [];
  cantidadRegistrosTarifas: any;
  filtroTipoOperacionSelect: any;
  filtroTipoServicioSelect: any;
  filtroTipoComisionSelect: any;
  filtroUnidadCobro: any;
  filtroValorComision: number;
  filtroInicioVigencia: any;
  filtroFinVigencia: any;
  filtroEstado: any;
  vigenciaActual: boolean = true;
  vigenciaPasada: boolean = false;
  vigenciaSeleccionada: 'ACTUAL' | 'PASADA' = 'ACTUAL';
  btnEliminar: boolean = false;
  btnExportar: boolean = false;
  btnAdicionar: boolean = false;
  opcionesTipoComision: { value: string }[] = [];
  erroresEliminacion: any[];

  constructor(private generalesService: GeneralesService,
    private tarifasEspecialesService: TarifasEspecialesService, private gestionPuntosService: GestionPuntosService,
    private dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    this.paginaTarifas = 0;
    this.tamanoTarifas = 2147483647;
    await this.iniciarDesplegables();
  }

  async iniciarDesplegables() {

    const _bancos = await this.generalesService.listarBancosAval().toPromise();
    this.bancos = _bancos.data;

    const _tipoDocumentos = await await this.generalesService.listarDominioByDominio({
      'dominio': "TIPO_DOCUMENTO"
    }).toPromise();
    this.tipoDocumentos = _tipoDocumentos.data;

    const _tipoOperaciones = await this.generalesService.listarDominioByDominio({
      'dominio': "TIPO_OPERACION_TARIFA_ESPECIAL"
    }).toPromise();
    this.tipoOperaciones = _tipoOperaciones.data;
    this.tipoOperacion = ['Seleccione', ..._tipoOperaciones.data];

    const _tipoServicio = await this.generalesService.listarDominioByDominio({
      'dominio': "TIPO_SERVICIO"
    }).toPromise();
    this.tipoServicios = _tipoServicio.data;

    const _comisionAplicar = await this.generalesService.listarDominioByDominio({
      'dominio': "COMISION_APLICAR"
    }).toPromise();
    this.comisionesAplicar = _comisionAplicar.data;

    const _unidadCobro = await this.generalesService.listarDominioByDominio({
      'dominio': "UNIDAD_COBRO"
    }).toPromise();
    this.unidadCobro = _unidadCobro.data;

    const _aplicaA = await this.generalesService.listarDominioByDominio({
      'dominio': "APLICA_A"
    }).toPromise();
    this.aplicaA = _aplicaA.data;


  }

  filtrar(filtro: string, event: any) {
    const campos = {
      ciudad: 'nombreCiudad',
      punto: 'nombrePunto',
      operacion: 'tipoOperacion',
      comision: 'tipoComision'
    };

    const campo = campos[filtro];
    if (!campo) return;

    // Normaliza: si viene TODAS pero sin el campo esperado, lo igualamos
    let rawValue = typeof event === 'string' ? event : event?.[campo] || '';
    if (!rawValue && event?.codigoNombreCiudad === 'TODAS' && campo === 'nombreCiudad') {
      rawValue = 'TODAS';
    }

    const filterValue = rawValue.toString().toLowerCase();

    // Si el usuario selecciona "Seleccione", limpiamos sólo ese filtro
    if (filterValue === 'seleccione') {
      this.dataSourceTarifasEspeciales.filter = '';
      return;
    }

    // Caso normal: aplica el filtro

    this.dataSourceTarifasEspeciales.filterPredicate = (data, filter) =>
      (data?.[campo] || '').toString().toLowerCase().includes(filter);

    this.dataSourceTarifasEspeciales.filter = filterValue;
  }




  async buscarCliente() {
    this.nombreCliente = null;
    this.ciudadSelect = null;
    this.codigoPuntoSelect = null;
    this.nombrePuntoSelect = null;
    this.tipoOperacionSelect = null;
    this.tipoComisionSelect = null;
    this.idsSeleccionados = []
    this.btnEliminar = false;
    this.dataSourceTarifasEspeciales = new MatTableDataSource
    let params;
    params = {
      'codigoBancoAval': Number(this.filtroBancoSelect.codigoPunto),
      'tipoId': this.tipoDocumentoSelect,
      'identificacion': Number(this.numeroDocumento),
      page: 0,
      size: 5000
    };
    const _clientes = await this.generalesService.listarClientes(params).toPromise();
    this.clientes = _clientes.data;
    if (this.clientes.length > 0) {
      if (this.clientes[0].amparado === true) {
        if (this.clientes[0].aplicaTarifaEspecial === false) {
          Swal.fire({
            text: "El cliente consultado NO le aplica tarifa especial",
            icon: 'warning',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.close();
            }
          });
        } else {
          this.nombreCliente = this.clientes[0].nombreCliente;
          this.codigoCliente = this.clientes[0].codigoCliente;
          const _datosCliente = await this.tarifasEspecialesService.consultarTarifasEspeciales({
            codigoCliente: this.codigoCliente,
            vigencias: this.vigenciaSeleccionada,
            page: 0,
            size: 5000
          }).toPromise();
          this.dataSourceTarifasEspeciales = new MatTableDataSource(_datosCliente.data.content);
          this.dataSourceTarifasEspeciales.sort = this.sort;
          this.dataSourceTarifasEspeciales.paginator = this.paginator;
          this.cantidadRegistros = _datosCliente.data.length;
          this.btnExportar = _datosCliente.data.content.length > 0;
          this.btnAdicionar = _datosCliente.data.content.length >= 0;

          const _ciudades = await this.gestionPuntosService
            .listarPuntosAsociados({ codigoCliente: this.codigoCliente })
            .toPromise();
          let ciudadesTemp = _ciudades.data.filter(
            (c, index, self) =>
              index === self.findIndex(ci => ci.nombreCiudad === c.nombreCiudad)
          );
          ciudadesTemp = ciudadesTemp.filter(c => c.nombreCiudad !== 'TODAS');
          ciudadesTemp.sort((a, b) =>
            a.nombreCiudad.localeCompare(b.nombreCiudad, 'es', { sensitivity: 'base' })
          );
          this.ciudades = [
            { nombreCiudad: 'Seleccione' }, { nombreCiudad: 'TODAS' }, ...ciudadesTemp];

          const _puntos = await this.gestionPuntosService
            .listarPuntosAsociados({ codigoCliente: this.codigoCliente })
            .toPromise();
          let puntosTemp = _puntos.data.filter(
            (c, index, self) => index === self.findIndex(ci => ci.nombrePunto === c.nombrePunto)
          );
          puntosTemp.sort((a, b) =>
            a.nombrePunto.localeCompare(b.nombrePunto, 'es', { sensitivity: 'base' })
          );
          this.nombrePuntos = [{ nombrePunto: 'Seleccione' }, { nombrePunto: 'TODOS' }, ...puntosTemp];

          if (this.cantidadRegistros > 0) {
            this.filtrosClientes = false;
          }
        }
      } else {
        Swal.fire({
          text: "El cliente NO es amparado",
          icon: 'warning',
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.close();
          }
        });
      }
    } else {
      Swal.fire({
        text: "El cliente consultado no existe, por favor intente nuevamente.",
        icon: 'warning',
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.close();
        }
      });
    }

  }

  limpiar() {
    this.filtroBancoSelect = null;
    this.tipoDocumentoSelect = null;
    this.numeroDocumento = null;
    this.nombreCliente = null;
    this.ciudadSelect = null;
    this.codigoPuntoSelect = null;
    this.nombrePuntoSelect = null;
    this.tipoOperacionSelect = null;
    this.tipoComisionSelect = null;
    this.dataSourceTarifasEspeciales = new MatTableDataSource
    this.buscar = false
  }

  validarBuscar(event) {
    if (this.filtroBancoSelect && this.tipoDocumentoSelect && this.numeroDocumento) {
      this.buscar = true
    } else {
      this.buscar = false
    }
  }

  async listarTarifasEspeciales(pagina = 0, tamanio = 2147483647) {

    let params = {
      page: pagina,
      size: tamanio,
      'codigoPuntoTarifaEspecial': this.codigoPunto
    };
    const _tarifas = await this.tarifasEspecialesService.consultarTarifasEspecialesPunto(params).toPromise();
    this.dataTarifasPuntoArray = _tarifas.data.content

  }



  eliminarTarifaEspecial() {
    Swal.fire({
      title: "¿Está seguro que desea eliminiar el/los registros seleccionados?",
      imageUrl: "assets/img/waring.jpg",
      imageWidth: 80,
      imageHeight: 80,
      confirmButtonText: "Si",
      showConfirmButton: true,
      showCancelButton: true,
      cancelButtonText: "No",
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminando registros...",
          html: `<div style="width:100%; background:#eee; border-radius:4px;">
                 <div id="barra-progreso" style="
                    width: 0%;
                    height: 10px;
                    background: #4caf50;
                    border-radius:4px;
                    transition: width 0.3s;
                  "></div>
               </div>
               <p id="contador">0 / ${this.idsSeleccionados.length}</p>`,
          allowOutsideClick: false,
          showConfirmButton: false,
          timer: 5000,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        this.erroresEliminacion = [];
        this.eliminarUnoPorUno(0);
      }
    });
  }

  private erroresIds: any[] = [];
  private mensajeErrorGlobal = '';

  private eliminarUnoPorUno(indice: number) {
    if (indice >= this.idsSeleccionados.length) {
      Swal.close();

      const eliminadosOk = this.idsSeleccionados.length - this.erroresIds.length;

      if (eliminadosOk === 0 && this.erroresIds.length > 0) {
        // Caso: ninguno se eliminó
        Swal.fire({
          icon: 'error',
          title: 'No se eliminaron registros',
          html: `
          <p>❌ Falló la eliminación de los siguientes idTarifaEspecial:</p>
          <pre>${this.erroresIds.join(', ')}</pre>
          <p>${this.mensajeErrorGlobal}</p>
        `
        });
      } else if (this.erroresIds.length > 0) {
        // Caso: algunos fallaron
        Swal.fire({
          icon: 'warning',
          title: 'Proceso finalizado con errores',
          html: `
          <p>Se eliminaron correctamente <b>${eliminadosOk}</b> de ${this.idsSeleccionados.length} registros.</p>
          <p>❌ Falló la eliminación de los siguientes idTarifaEspecial</p>
          <pre>${this.erroresIds.join(', ')}</pre>
          <p>${this.mensajeErrorGlobal}</p>
        `
        });
      } else {
        // Caso: todos OK
        Swal.fire({
          icon: 'success',
          title: 'Proceso completado',
          text: 'Todos los registros seleccionados fueron eliminados correctamente.'
        }).then((result) => {
          if (result.isConfirmed) {
            this.buscarCliente();
          }
        });
      }
      return;
    }

    const id = this.idsSeleccionados[indice];

    this.tarifasEspecialesService.eliminarTarifaEspeciales({ idTarifaEspecial: id }).subscribe({
      next: (response: any) => {
        if (response?.response?.description !== 'Registro eliminado correctamente.') {
          this.erroresIds.push(id);
          if (!this.mensajeErrorGlobal) {
            this.mensajeErrorGlobal = response?.response?.description || 'Error desconocido';
          }
        }
        this.actualizarProgreso(indice + 1);
        this.eliminarUnoPorUno(indice + 1);
      },
      error: (err) => {
        this.erroresIds.push(id);
        if (!this.mensajeErrorGlobal) {
          this.mensajeErrorGlobal =
            err?.error?.response?.description || 'Error en la eliminación';
        }
        this.actualizarProgreso(indice + 1);
        this.eliminarUnoPorUno(indice + 1);
      }
    });
  }

  private actualizarProgreso(actual: number) {
    const progreso = Math.round((actual / this.idsSeleccionados.length) * 100);
    const barra = document.getElementById("barra-progreso") as HTMLElement;
    const contador = document.getElementById("contador") as HTMLElement;
    if (barra) barra.style.width = progreso + "%";
    if (contador) contador.textContent = `${actual} / ${this.idsSeleccionados.length}`;
  }

  onKeypressEvent(event: any): any {
    if (event.charCode < 48 || event.charCode > 57) return false;
  }


  seleccionarTodo() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataTarifasPunto.data.length;
    return numSelected === numRows;
  }

  seleccion() {
    this.seleccionarTodo() ? this.selection.clear() : this.dataTarifasPunto.data.forEach(row => this.selection.select(row));
    this.seleccionadosTarifas = this.selection.selected
  }

  seleccionRow(event, row) {
    if (event.checked === true) {
      this.seleccionadosTarifas.push(row)
    } else {
      this.seleccionadosTarifas = this.seleccionadosTarifas.filter((element) => element.idTarifaEspecial != row.idTarifaEspecial)
    }
  }

  idsSeleccionados: number[] = [];

  onRowToggle(row: any) {
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.idsSeleccionados.push(row.idTarifaEspecial);
    } else {
      this.idsSeleccionados = this.idsSeleccionados.filter(id => id !== row.idTarifaEspecial);
    }
    this.btnEliminar = this.idsSeleccionados.length > 0;
  }

  onVigenciaChange(tipo: 'ACTUAL' | 'PASADA') {
    this.vigenciaSeleccionada = tipo;
    this.vigenciaActual = (tipo === 'ACTUAL');
    this.vigenciaPasada = (tipo === 'PASADA');
  }

  abrirModal(event, flag) {
    const dialogRef = this.dialog.open(AdicionarEditarTarifaEspecialComponent, {
      width: '1000px',
      data: {
        banco: this.filtroBancoSelect,
        tipoDocumento: this.tipoDocumentoSelect,
        numeroDocumento: this.numeroDocumento,
        nombreCliente: this.nombreCliente,
        idCliente: this.codigoCliente,
        dataEditar: { ...event, valorTarifa: event?.valorTarifa.toFixed(6), valorComisionAdicional: event?.valorComisionAdicional.toFixed(6) },
        flag: flag,
        codigoBanco: this.clientes[0].codigoBancoAval
      }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        this.buscarCliente()
        console.log('Guardó cambios', resultado);
      } else {
        console.log('Canceló');
      }
    });
  }


  async onOperacionChange(operacion: string) {
    if (operacion === 'PROVISION') {
      const _tipoComision = await this.generalesService.listarDominioByDominio({
        'dominio': "COMISION_TARIFA_ESPECIAL_PROVISION"
      }).toPromise();
      this.opcionesTipoComision = ['Seleccione', ..._tipoComision.data];
    } else if (operacion === 'RECOLECCION') {
      const _tipoComision = await this.generalesService.listarDominioByDominio({
        'dominio': "COMISION_TARIFA_ESPECIAL_RECOLECCION"
      }).toPromise();
      this.opcionesTipoComision = ['Seleccione', ..._tipoComision.data];
    } else {
      this.opcionesTipoComision = [];
    }
    this.tipoComisionSelect = null;
  }

}
