import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { catchError, debounceTime, distinctUntilChanged, lastValueFrom, map, Observable, of, startWith, switchMap } from "rxjs";
import { ClientesCorporativosService } from "src/app/_service/administracion-service/clientes-corporativos.service";
import { GestionPuntosService } from "src/app/_service/administracion-service/gestionPuntos.service";
import { VentanaEmergenteResponseComponent } from "src/app/pages/shared/components/ventana-emergente-response/ventana-emergente-response.component";
import { GENERALES } from "src/app/pages/shared/constantes";


@Component({
    selector: 'app-form-codigo-tdv',
    templateUrl: './form-codigo-tdv.component.html',
    styleUrls: ['./form-codigo-tdv.component.css']
})
export class FormCodigoTdvComponent implements OnInit {

    @Input() initialData: any; // For editing
    @Input() bancos: any[] = [];
    @Input() transportadoras: any[] = [];
    @Input() ciudades: any[] = [];
    @Input() tiposPunto: any[] = []; 

    @Output() formSubmit = new EventEmitter<any>();
    @Output() cancel = new EventEmitter<void>();

    form: FormGroup = new FormGroup({
        'idPuntoCodigo': new FormControl(),
        'punto': new FormControl(),
        'codigoPunto': new FormControl(),
        'codigoTdv': new FormControl(),
        'codigoPropioTDV': new FormControl(),
        'banco': new FormControl(),
        'estado': new FormControl(),
        'codigoDANE': new FormControl(),
        'cliente': new FormControl(),
        'tipoPunto': new FormControl()
    });
    esEdicion: boolean = false;
    selectedTipoPunto: string = "";

    // Puntos deben ser cargados con base en tipo punto y criterio de tipo (por definir cada uno)
    puntos: any[] = [];
    puntosFiltrados: Observable<any[]>;
    puntosControl = new FormControl();
    // clientes deben ser cargados con base en tipo punto y banco
    clientes: any[] = [];
    clientesFiltrados: Observable<any[]>;
    clientesControl = new FormControl();

    spinnerActive: boolean = false;

    constructor(
        private readonly puntosService: GestionPuntosService,
        private readonly clientesCorporativosService: ClientesCorporativosService,
        private readonly dialog: MatDialog
    ) { }

    ngOnInit(): void {
        
        if (this.initialData) {
            this.esEdicion = true;
            // Cargar cliente y punto del registro seleccionado para editar
            this.loadInitialDropDowns();
        } else {
            this.esEdicion = false;
        }
        this.initForm(this.initialData);

        this.clientesFiltrados = this.clientesControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap( value => {
                const searchTerm = typeof value === 'string' ? value : value?.identificacion;
                return searchTerm ? this._filterCliente(searchTerm) : of([])
            })
        );
        this.puntosFiltrados = this.puntosControl.valueChanges.pipe(
            startWith(''),
            debounceTime(300),
            distinctUntilChanged(),
            switchMap( value => {
                const searchTerm = typeof value === 'string' ? value : value?.codigoPunto;
                return searchTerm ? this._filterPunto(searchTerm) : of([])
            })
        );
    }

    async initForm(param?: any) {
        let ciudad = '';
        let puntoValueForm: any;
        let clienteValueForm: any;
        let bancoValueForm: any;
        let tdvValueForm: any;

        if (param) {
            this.selectedTipoPunto = param.puntosDTO.tipoPunto;
            if (param.ciudadFondo && this.ciudades.length > 0) {
                ciudad = this.ciudades.find((value) => value.codigoDANE == param.ciudadFondo);
            }

            if (this.puntos.length > 0) {
                puntoValueForm = this.puntos.find((value) => value.codigoPunto == param.puntosDTO.codigoPunto);
            }
            if (this.clientes.length > 0) {
                clienteValueForm = param.puntosDTO.sitiosClientes?.codigoCliente;
            }
            if (this.bancos.length > 0) {
                bancoValueForm = this.bancos.find((value) => value.codigoPunto == param.bancosDTO?.codigoPunto);
            }
            if (this.transportadoras.length > 0) {
                tdvValueForm = this.transportadoras.find((value) => value.codigo == param.codigoTDV);
            }
        }
        this.clientesControl = new FormControl(param ? clienteValueForm : null, [Validators.required]); 
        this.puntosControl = new FormControl(param ? puntoValueForm : null, [Validators.required]);
        this.form = new FormGroup({
            'idPuntoCodigo': new FormControl(param ? param.idPuntoCodigoTdv : null),
            'punto': this.puntosControl,
            'codigoPunto': new FormControl(param ? param.codigoPunto : null),
            'codigoTdv': new FormControl(tdvValueForm ?? null, [Validators.required]),
            'codigoPropioTDV': new FormControl(param?.codigoPropioTDV ?? null, [Validators.required]),
            'banco': new FormControl(bancoValueForm ?? null, [Validators.required]),
            'estado': new FormControl(param ? param.estado === 1 : true),
            'codigoDANE': new FormControl(ciudad ?? "0", [Validators.required]),
            'cliente': this.clientesControl,
            'tipoPunto': new FormControl(param ? param.puntosDTO.tipoPunto : null, [Validators.required])
        });

        // En edicion, no permite cambiar tipo de punto
        if (this.esEdicion && param?.puntosDTO.tipoPunto) {
            this.form.get('tipoPunto').disable();

            this.updateValidatorsForm();
        }
    }

    async loadInitialDropDowns() {
        if (!this.initialData) return;

        this.spinnerActive = true;
        try {
            const param = this.initialData;
            this.selectedTipoPunto = param.puntosDTO.tipoPunto; 

            let initialParams: any = {
                tipoPunto: this.selectedTipoPunto,
                page: 0,
                size: 5000 
            };

            this.form.controls['banco'].setValidators(Validators.required);

            if (this.selectedTipoPunto === "FONDO") {
                initialParams['fondos.bancoAVAL'] = Number(param.bancosDTO.codigoPunto);
            } else if (this.selectedTipoPunto === "OFICINA") {
                initialParams['oficinas.bancoAVAL'] = Number(param.bancosDTO.codigoPunto);
            } else if (this.selectedTipoPunto === "CAJERO") {
                initialParams['cajeroATM.bancoAval'] = Number(param.bancosDTO.codigoPunto);
            } else if (this.selectedTipoPunto === "CLIENTE") {
                let clienteParams = {
                    'codigoBancoAVAL': Number(param.bancosDTO.codigoPunto),
                    'codigoCliente': Number(param.puntosDTO.sitiosClientes.codigoCliente.codigoCliente),
                    page: 0,
                    size: 5000
                };
                // se espera retorne 1 unico cliente
                await this.listarClientes(clienteParams);
                
                if (param.puntosDTO.sitiosClientes?.codigoCliente && this.clientes.length > 0) {
                    const clienteValue = this.clientes.find(c => c.codigoCliente === param.puntosDTO.sitiosClientes.codigoCliente);
                    this.form.get('cliente').setValue(clienteValue);
                }
                initialParams['cliente'] = param.puntosDTO.sitiosClientes?.codigoCliente;
            }

            if (this.selectedTipoPunto === "BAN_REP" || this.selectedTipoPunto === "BANCO") {
                this.form.controls['banco'].removeValidators(Validators.required);
            }

            this.form.controls['banco'].updateValueAndValidity();

            if (this.selectedTipoPunto) { 
                await this.listarPuntos(initialParams);
            }

            //this.initForm(this.initialData);

        } catch (error) {
            console.error("Error loading initial dropdowns: ", error);
        } finally {
            this.spinnerActive = false;
        }
    }

    async onSubmit() {
        if (this.form.invalid) {
            this.dialog.open(VentanaEmergenteResponseComponent, {
                width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                data: {
                    msn: "Formulario inválido. Por favor revise los campos.",
                    codigo: GENERALES.CODE_EMERGENT.ERROR,
                }
            });
            return;
        }

        this.spinnerActive = true;
        const formData = this.form.getRawValue();

        const puntoCodigoPayload = {
            idPuntoCodigoTdv: formData.idPuntoCodigo,
            codigoTDV: formData.codigoTdv.codigo, 
            codigoPunto: Number(formData.punto.codigoPunto), 
            codigoPropioTDV: formData.codigoPropioTDV,
            ciudadFondo: formData.codigoDANE.codigoDANE ?? '0',
            bancosDTO: {
                codigoPunto: Number(formData.banco.codigoPunto) 
            },
            puntosDTO: {
                codigoPunto: Number(formData.punto.codigoPunto)
            },
            estado: Number(formData.estado ? 1 : 0),
        };

        this.formSubmit.emit(puntoCodigoPayload);
    }

    onCancel() {
        this.cancel.emit();
    }

    /**
     * Asigna valor a propiedad global con el tipo de punto seleccionado
     * hacer reset al formulario
     * @param event 
     * @returns 
     */
    async changeTipoPunto(event: any) {
        this.selectedTipoPunto = event?.value;
        this.form.get('banco').setValue(null);
        this.form.get('punto').setValue(null);
        this.form.get('cliente').setValue(null);
        this.form.get('codigoDANE').setValue('0');

        this.puntos = [];
        this.clientes = [];
        this.updateValidatorsForm();

        this.form.controls['codigoPunto'].setValue('');
    }

    updateValidatorsForm() {

        this.form.controls['banco'].setValidators(Validators.required);
        this.form.controls['cliente'].setValidators(Validators.required);

        if (this.selectedTipoPunto === 'BAN_REP' || this.selectedTipoPunto === 'BANCO') {
            this.form.controls['banco'].removeValidators(Validators.required);            
        }

        if (this.selectedTipoPunto !== 'CLIENTE') {
            this.form.controls['cliente'].removeValidators(Validators.required);
        }
        
        this.form.controls['banco'].updateValueAndValidity();
        this.form.controls['cliente'].updateValueAndValidity();
    }

    /**
     * Filtrar puntos por tipo, en los casos que aplique
     * @param event 
     * @returns 
     */
    async changeBanco(event: any) {
        if (!this.selectedTipoPunto) 
            return;
    }

    async listarClientes(params: any) {
        this.spinnerActive = true;
        try {
            const response = await lastValueFrom(this.clientesCorporativosService.listarClientesCorporativos(params));
            this.clientes = response.data.content;
        } catch (err) {
            this.dialog.open(VentanaEmergenteResponseComponent, {
                width: GENERALES.MESSAGE_ALERT.SIZE_WINDOWS_ALERT,
                data: {
                    msn: GENERALES.MESSAGE_ALERT.MESSAGE_CRUD.ERROR_DATA_FILE,
                    codigo: GENERALES.CODE_EMERGENT.ERROR,
                    showResume: true,
                    msgDetalles: JSON.stringify(err.error)
                }
            });
        } finally {
            this.spinnerActive = false;
        }
    }

    async listarPuntos(params?: any) {
        if (!params.tipoPunto && !this.selectedTipoPunto) {
            this.puntos = []; // Clear puntos if tipoPunto is not set
            return;
        }
        // Ensure tipoPunto is part of params if not already
        if (!params.tipoPunto) {
            params.tipoPunto = this.selectedTipoPunto;
        }

        this.spinnerActive = true;
        try {
            const response = await lastValueFrom(this.puntosService.listarPuntosCreados(params));
            this.puntos = response.data.content;
        } catch (err) {
            console.error("Error in listarPuntos: ", err);
            this.puntos = []; // Clear puntos on error
            // Consider showing a dialog, but be mindful of repeated errors if called often
        } finally {
            this.spinnerActive = false;
        }
    }
    
    changePunto(event: any) {
        this.spinnerActive = true; 
        if (event.value) {
            this.form.controls['codigoPunto'].setValue(event.value.codigoPunto);
            if (this.form.controls['tipoPunto'].value === 'BAN_REP') {
                this.form.controls['codigoDANE'].setValue(event.value.codigoCiudad);
            } else {
                this.form.controls['codigoDANE'].setValue('0');
            }
        } else {
            this.form.controls['codigoPunto'].setValue(null);
            this.form.controls['codigoDANE'].setValue('0');
        }
        this.spinnerActive = false;
    }

    /**
     * @author prv_nparra
     */
    private _filterCliente(value: string): Observable<any[]> {
        if(value.length < 3) return of([]);

        const params = {
            codigoBancoAval: this.form.get('banco').value.codigoPunto,
            busqueda: value,
            page: 0,
            size: 100
        };

        return this.clientesCorporativosService.listarClientesCorporativos(params).pipe(
            map(response => response.data.content),
            catchError(() => of([]))
        );
    }

    /**
    * @author prv_nparra
    */
    displayCliente(c: any): string {
        return c?.identificacion ? c.identificacion + ' - ' + c.nombreCliente : '';
    }

    /**
     * @author prv_nparra
     */
    private _filterPunto(value: string): Observable<any[]> {
        if(value.length < 3) return of([]);

        const bancoCodigoPunto = this.form.get('banco').value.codigoPunto;
        const params = {
            tipoPunto: this.selectedTipoPunto,
            busqueda: value,
            page: 0,
            size: 100
        };
        
        switch (this.selectedTipoPunto) {
            case "FONDO":
                params['fondos.bancoAVAL'] = bancoCodigoPunto;
                break;
            case "OFICINA":
                params['oficinas.bancoAVAL'] = bancoCodigoPunto;
                break;
            case "CAJERO":
                params['cajeroATM.bancoAval'] = bancoCodigoPunto;
                break;
            case "CLIENTE":
                params['sitiosClientes.codigoCliente.codigoCliente'] = this.form.get('cliente').value.codigoCliente;
                break;
            default:
                break;
        }
        
        return this.puntosService.listarPuntosCreados(params).pipe(
            map(response => response.data.content),
            catchError(() => of([]))
        );
    }

    /**
    * @author prv_nparra
    */
    displayPunto(c: any): string {
        let codigo = '';
        
        if(this.selectedTipoPunto === 'CLIENTE') {
            codigo = c.sitiosClientes?.identificadorCliente;
        }
        
        return c?.codigoPunto ? codigo + '' + c.nombrePunto : '';
    }
}