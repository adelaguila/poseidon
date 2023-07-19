import {Component, OnInit} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-menu',
    template: `
        <ul class="layout-menu">
            <li app-menuitem *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true"></li>
        </ul>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public app: AppComponent) {}

    ngOnInit() {
        this.model = [
            {
                label: 'Favorites', icon: 'pi pi-fw pi-home',
                items: [
                    {label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },
            {
                label: 'Operaciones', icon: 'pi pi-fw pi-microsoft',
                items: [
                    {label: 'Abonados', icon: 'pi pi-fw pi-globe', routerLink: ['/admin/abonados']},
                ]
            },
            {
                label: 'Mantenimientos', icon: 'pi pi-fw pi-table',
                items: [
                    {label: 'Clientes/Proveedores', icon: 'pi pi-fw pi-th-large', routerLink: ['/admin/terceros']},
                    {label: 'Cajas Nap', icon: 'pi pi-fw pi-box', routerLink: ['/admin/cajasnap']},
                    {label: 'Planes', icon: 'pi pi-fw pi-book', routerLink: ['/admin/planes']},
                    {label: 'Sectores', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/sectores']},
                    {label: 'Tipos Ordenes Atenciones', icon: 'pi pi-fw pi-tag', routerLink: ['/admin/tipos-ordenes-atenciones']},
                    {label: 'Vias', icon: 'pi pi-fw pi-map-marker', routerLink: ['/admin/vias']},
                    {label: 'Ubigeos', icon: 'pi pi-fw pi-map', routerLink: ['/admin/ubigeos']},
                    {label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/admin/usuarios']},
                ]
            },
            // {
            //     label: 'UI Kit', icon: 'pi pi-fw pi-star-fill', routerLink: ['/admin/demo/uikit'],
            //     items: [
            //         {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/admin/demo/uikit/formlayout']},
            //         {label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/admin/demo/uikit/input']},
            //         {label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/admin/demo/uikit/floatlabel']},
            //         {label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/admin/demo/uikit/invalidstate']},
            //         {label: 'Button', icon: 'pi pi-fw pi-mobile', routerLink: ['/admin/demo/uikit/button'], class: 'rotated-icon'},
            //         {label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/admin/demo/uikit/table']},
            //         {label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/admin/demo/uikit/list']},
            //         {label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/admin/demo/uikit/tree']},
            //         {label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/admin/demo/uikit/panel']},
            //         {label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/admin/demo/uikit/overlay']},
            //         {label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/admin/demo/uikit/media']},
            //         {label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/admin/demo/uikit/menu'], preventExact: true},
            //         {label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/admin/demo/uikit/message']},
            //         {label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/admin/demo/uikit/file']},
            //         {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/admin/demo/uikit/charts']},
            //         {label: 'Misc', icon: 'pi pi-fw pi-circle-off', routerLink: ['/admin/demo/uikit/misc']}
            //     ]
            // },
            // {
            //     label:'Prime Blocks', icon:'pi pi-fw pi-prime', routerLink: ['/blocks'],
            //     items:[
            //         {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks']},
            //         {label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank'},
            //     ]
            // },
            // {
            //     label: 'Utilities', icon: 'pi pi-fw pi-compass', routerLink: ['/utilities'],
            //     items: [
            //         {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['utilities/icons']},
            //         {label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank'},
            //     ]
            // },
            // {
            //     label: 'Pages', icon: 'pi pi-fw pi-briefcase',
            //     items: [
            //         {label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud']},
            //         {label: 'Calendar', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/calendar']},
            //         {label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/pages/timeline']},
            //         {label: 'Landing', icon: 'pi pi-fw pi-globe', url: 'assets/pages/landing.html', target: '_blank'},
            //         {label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/login']},
            //         {label: 'Invoice', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/invoice']},
            //         {label: 'Help', icon: 'pi pi-fw pi-question-circle', routerLink: ['/pages/help']},
            //         {label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/error']},
            //         {label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/notfound']},
            //         {label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/access']},
            //         {label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty']}
            //     ]
            // },
            {
                label: 'Operaciones', icon: 'pi pi-fw pi-align-left',
                items: [
                    {
                        label: 'Abonados', icon: 'pi pi-fw pi-align-left',
                        items: [
                            {label: 'Lista', icon: 'pi pi-fw pi-map', routerLink: ['/admin/abonados']},
                            // {label: 'Registrar', icon: 'pi pi-fw pi-map', routerLink: ['/admin/abonados']},
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'pi pi-fw pi-align-left',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-align-left'},
                                    {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-align-left'},
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-align-left',
                                items: [
                                    {label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-align-left'},
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Start', icon: 'pi pi-fw pi-download',
                items: [
                    {
                        label: 'Buy Now', icon: 'pi pi-fw pi-shopping-cart', url: ['https://www.primefaces.org/store']
                    },
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-info-circle', routerLink: ['/documentation']
                    }
                ]
            }
        ];
    }
}
