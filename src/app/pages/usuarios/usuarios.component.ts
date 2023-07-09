import { Component, ViewChild } from "@angular/core";
import { Usuario } from "./usuario.model";
import { UsuarioService } from "./usuario.service";
import {
    ConfirmationService,
    LazyLoadEvent,
    MessageService,
} from "primeng/api";
import { UsuarioInterface } from "./usuario.interface";
import { Table } from "primeng/table";
import { FilterModel } from "src/app/utilities/filter-model";
import { Util } from "src/app/utilities/util";

@Component({
    selector: "app-usuarios",
    templateUrl: "./usuarios.component.html",
    styleUrls: ["./usuarios.component.scss"],
    providers: [MessageService, ConfirmationService],
})
export class UsuariosComponent {
    @ViewChild("dt") table: Table;

    usuarioDialog: boolean = false;

    totalRecords!: number;

    currentPage = 1;

    loading: boolean = false;

    selectAll: boolean = false;

    deleteUsuarioDialog: boolean = false;

    deleteUsuariosDialog: boolean = false;

    usuarios: Usuario[] = [];

    usuario: UsuarioInterface = {};

    selectedUsuarios: Usuario[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    listRoles: any[] = [];

    rowsPerPageOptions = [2, 5, 10, 20, 50];

    rows = 2;

    _filter: FilterModel = new FilterModel();
    _filterPage: any = "";

    constructor(
        private usuariosService: UsuarioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private util: Util
    ) {}

    ngOnInit() {
        // this.usuariosService.getUsuarios().subscribe((data:any) => this.usuarios = data.data);

        this.cols = [
            { field: "image", header: "Avatar" },
            { field: "id", header: "ID" },
            { field: "fullName", header: "Usuario" },
            { field: "email", header: "Email" },
            { field: "roles", header: "Roles" },
            { field: "isActive", header: "Estado" },
        ];
        this.loading = true;

        this.listRoles = [
            { label: "Super Admin", value: "superadmin" },
            { label: "Administrador", value: "admin" },
            { label: "Técnico", value: "tecnico" },
            { label: "Cajero", value: "cajero" },
            { label: "Cobrador", value: "cobrador" },
            { label: "Visitante", value: "user" },
        ];
    }


    loadUsuarios(event: LazyLoadEvent) {
        this.rows = event.rows;
        console.log(event);

        this._filterPage = this.util.NestJsonFilter(event.filters);

        this.loading = true;
        this.usuariosService
            .getUsuarios(event, this.currentPage, this._filterPage)
            .subscribe((res) => {
                this.usuarios = res.data;
                this.totalRecords = res.meta.totalItems;
                this.currentPage = res.meta.currentPage + 1;
                this.loading = false;
            });
    }

    onPage(event: any) {
        console.log(event);
        if(event.first == 0){
            this,this.currentPage = 1;
        }else{

        }

    }

    onSelectionChange(value = []) {
        this.selectAll = value.length === this.totalRecords;
        this.selectedUsuarios = value;
    }

    onSelectAllChange(event: any) {
        const checked = event.checked;

        if (checked) {
            this.usuariosService.getUsuarios().subscribe((res) => {
                this.selectedUsuarios = res.data;
                this.selectAll = true;
            });
        } else {
            this.selectedUsuarios = [];
            this.selectAll = false;
        }
    }

    openNew() {
        this.usuario = {};
        this.submitted = false;
        this.usuarioDialog = true;
    }

    deleteSelectedUsuarios() {
        this.deleteUsuariosDialog = true;
    }

    editUsuario(usuario: UsuarioInterface) {
        this.usuario = { ...usuario };
        this.usuarioDialog = true;
    }

    deleteUsuario(usuario: UsuarioInterface) {
        this.deleteUsuarioDialog = true;
        this.usuario = { ...usuario };
    }

    confirmDeleteSelected() {
        this.deleteUsuariosDialog = false;
        this.usuarios = this.usuarios.filter(
            (val) => !this.selectedUsuarios.includes(val)
        );
        this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Usuarios Deleted",
            life: 3000,
        });
        this.selectedUsuarios = [];
    }

    confirmDelete() {
        this.deleteUsuarioDialog = false;
        this.usuarios = this.usuarios.filter(
            (val) => val.id !== this.usuario.id
        );
        this.messageService.add({
            severity: "success",
            summary: "Successful",
            detail: "Usuario Deleted",
            life: 3000,
        });
        this.usuario = {};
    }

    hideDialog() {
        this.usuarioDialog = false;
        this.submitted = false;
    }

    saveUsuario() {
        console.log(this.usuario);
        // this.submitted = true;

        // if (this.usuario.fullName?.trim()) {
        //     if (this.usuario.id) {
        //         // @ts-ignore
        //         // this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value : this.product.inventoryStatus;
        //         this.usuarios[this.findIndexById(this.usuario.id)] = this.usuario;
        //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Updated', life: 3000 });
        //     } else {
        //         this.usuario.id = '0';
        //         // this.usuario.code = this.createId();
        //         this.usuario.image = 'product-placeholder.svg';
        //         // @ts-ignore
        //         // this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
        //         this.usuarios.push(this.usuario);
        //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Usuario Created', life: 3000 });
        //     }

        //     this.usuarios = [...this.usuarios];
        //     this.usuarioDialog = false;
        //     this.usuario = {};
        // }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.usuarios.length; i++) {
            if (this.usuarios[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = "";
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "contains"
        );
    }
}
