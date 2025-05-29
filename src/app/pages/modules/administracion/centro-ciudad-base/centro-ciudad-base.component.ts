import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GENERALES } from 'src/app/pages/shared/constantes';
import { VentanaEmergenteResponseComponent } from 'src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component';
import { GeneralesService } from 'src/app/_service/generales.service';
import { CentrosCiudadService } from 'src/app/_service/administracion-service/centros-ciudad.service ';
import { ManejoFechaToken } from 'src/app/pages/shared/utils/manejo-fecha-token';
import { SpinnerComponent } from 'src/app/pages/shared/components/spinner/spinner.component';
import { lastValueFrom, Observable } from 'rxjs';

@Component({
    selector: 'app-centro-ciudad-base',
    templateUrl: './centro-ciudad-base.component.html',
    styleUrls: ['./centro-ciudad-base.component.css']
})
export class CentroCiudadBaseComponent implements OnInit {

    @Input() tipoCentroCiudad: string;

    form: FormGroup;
    dataSourceTiposCuentas: MatTableDataSource<any>
    displayedColumnsTiposCuentas: string[] = ['idCentroCiudad', 'bancoAval', 'ciudad', 'codigoCentro', 'acciones'];
    isDominioChecked = false;
    mostrarFormulario = false;
    bancos: any[] = [];
    ciudades: any[] = [];
    idCentroCiudad: any;
    esEdicion: boolean;
    spinnerActive: boolean = false;

    //Registros paginados
    @ViewChild(MatSort) sort: MatSort;
    cantidadRegistros: number;

    constructor(
        private readonly centroCiudadesService: CentrosCiudadService,
        private readonly generalServices: GeneralesService,
        private readonly dialog: MatDialog,
        public spinnerComponent: SpinnerComponent
    ) { }

    ngOnInit(): void {
        ManejoFechaToken.manejoFechaToken()
        this.datosDesplegables();
        this.listarCentrosCiudades();
    }

    /**
      * Se consumen servicios para desplegables
      * @BayronPerez
      */
    async datosDesplegables() {
        this.spinnerActive = true;
        await lastValueFrom(this.generalServices.listarBancosAval()).then((response) => {
            this.bancos = response.data;
            this.spinnerActive = false;
        });

        lastValueFrom(this.generalServices.listarCiudades()).then((response) => {
            this.ciudades = response.data;
            this.spinnerActive = false;
        });
    }

    /**
      * Inicializaion formulario de creacion y edicion
      * @BayronPerez
      */
    initForm(param?: any) {
        this.form = new FormGroup({
            'idCentroCiudad': new FormControl(param ? param.idCentroCiudad : null),
            'bancoAval': new FormControl(param ? this.bancos.find((value) => value.codigoPunto === param.bancoAval.codigoPunto) : null, [Validators.required]),
            'codigoDane': new FormControl(param ? this.ciudades.find((value) => value.codigoDANE === param.ciudadDane.codigoDANE) : null, [Validators.required]),
            'codigoCentro': new FormControl(param ? param.codigoCentro : null, [Validators.required, Validators.pattern('^[0-9]+$')]),
        });
    }

    /**
     * Lista los Centros ciudades
     * @BayronPerez
     */
    listarCentrosCiudades(pagina = 0, tamanio = 5) {
        let serviceCall: Observable<any>;
        this.spinnerActive = true;
        if (this.tipoCentroCiudad.includes('Principal')) {
            serviceCall = this.centroCiudadesService.obtenerCentrosCiudadesPpal({
                page: pagina,
                size: tamanio
            });
        } else {
            serviceCall = this.centroCiudadesService.obtenerCentrosCiudades({
                page: pagina,
                size: tamanio,
            });            
        }
        serviceCall.subscribe({
            next: (page: any) => {
                this.dataSourceTiposCuentas = new MatTableDataSource(page.data);
                this.dataSourceTiposCuentas.sort = this.sort;
                this.cantidadRegistros = page.data.totalElements;
                this.spinnerActive = false;
            },
            error: (err: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: GENERALES.MESSAGE_ALERT.MESSAGE_ADMIN_CENTRO_CIUDAD.ERROR_GET_TIPO_ADMIN_CENTRO_CIUDAD,
                        codigo: GENERALES.CODE_EMERGENT.ERROR,
                        showResume: true,
                        msgDetalles: JSON.stringify(err.response)
                    }
                });
                this.spinnerActive = false;
            }
        });
    }

    /**
      * Se realiza persistencia del formulario de centros ciudades
      * @BayronPerez
      */
    persistir() {
        let serviceCall: Observable<any>;
        let msgCrudSuccessfull: string;
        let msgCrudError: string;
        this.spinnerActive = true;
        const centrociudad = {
            idCentroCiudad: null,
            ciudadDane: {
                codigoDANE: this.form.value['codigoDane'].codigoDANE
            },
            bancoAval: {
                codigoPunto: this.form.value['bancoAval'].codigoPunto
            },
            codigoCentro: this.form.value['codigoCentro'],
        }

        if (this.esEdicion) {
            centrociudad.idCentroCiudad = this.idCentroCiudad;
            msgCrudSuccessfull = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_UPDATE;
            msgCrudError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_UPDATE;
            serviceCall = this.centroCiudadesService.actualizarCentroCiudade(centrociudad, 
                this.tipoCentroCiudad.includes('Principal')
            );
        } else {
            msgCrudSuccessfull = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_CREATE;
            msgCrudError = GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_CREATE;
            serviceCall = this.centroCiudadesService.guardarCentroCiudade(centrociudad, 
                this.tipoCentroCiudad.includes('Principal')
            );
        }

        serviceCall.subscribe({
            next: (page: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: msgCrudSuccessfull,
                        codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
                        showResume: true,
                        msgDetalles: JSON.stringify(page.response)
                    }
                });
                this.listarCentrosCiudades()
                this.initForm();
                this.spinnerActive = false;
            },
            error: (err: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: msgCrudError,
                        codigo: GENERALES.CODE_EMERGENT.ERROR,
                        showResume: true,
                        msgDetalles: JSON.stringify(err.response)
                    }
                });
                this.spinnerActive = false;
            }
        });

    }

    /**
      * Se muestra el formulario para crear centro ciudad
      * @BayronPerez
      */
    crearCentroCiudad() {
        this.initForm();
        this.form.get('idCentroCiudad').disable();
        this.mostrarFormulario = true;
        this.esEdicion = false;
    }

    /**
      * Se muestra el formulario para actualizar dentros ciudad
      * @BayronPerez
      */
    actualizarCentroCiudad() {
        this.initForm();
        this.mostrarFormulario = true;
    }

    editar(registro: any) {
        this.initForm(registro);
        this.mostrarFormulario = true;
        this.idCentroCiudad = this.form.get('idCentroCiudad').value;
        this.form.get('idCentroCiudad').disable();
        this.esEdicion = true;
    }

    /**
     * Visualiza dialogo de confirmacion para eliminar registro
     * @param registro 
     * @author prv_nparra
     */
    confirmaEliminar(element: any) {
        this.dialog.open(VentanaEmergenteResponseComponent, {
            width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
            data: {
                msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.MSG_DELETE_ROW,
                codigo: GENERALES.CODE_EMERGENT.WARNING,
                showActions: true
            }
        }).afterClosed().subscribe(result => {
            if(result !== undefined) {
              this.eliminar(element);
            };
        });

    }

    /**
     * Realiza operacion de eliminar registro de CentroCiudad Principal
     * @param registro 
     * @author prv_nparra
     */
    eliminar(registro: any) {
        let serviceCall: Observable<any>;
        this.spinnerActive = false;
        if(this.tipoCentroCiudad === 'Principal') {
            serviceCall = this.centroCiudadesService.eliminarCentroCiudadePpal(registro.idCentroCiudad);
        } else {
            serviceCall = this.centroCiudadesService.eliminarCentroCiudad(registro.idCentroCiudad);
        }

        serviceCall.subscribe({
            next: (page: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.SUCCESFULL_DELETE,
                        codigo: GENERALES.CODE_EMERGENT.SUCCESFULL,
                        showResume: true,
                        msgDetalles: JSON.stringify(page)
                    }
                });
                this.listarCentrosCiudades()
                this.initForm();
                this.spinnerActive = false;
            },
            error: (err: any) => {
                this.dialog.open(VentanaEmergenteResponseComponent, {
                    width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                    data: {
                        msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DELETE,
                        codigo: GENERALES.CODE_EMERGENT.ERROR,
                        showResume: true,
                        msgDetalles: JSON.stringify(err)
                    }
                });
                this.spinnerActive = false;
            }
        });
    }

}
