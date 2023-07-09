import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {AppCodeModule} from './blocks/app-code/app.code.component';
import {AppComponent} from './app.component';
import {AppMainComponent} from './app.main.component';
import {AppConfigComponent} from './app.config.component';
import {AppMenuComponent} from './app.menu.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {AppRightPanelComponent} from './app.rightpanel.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {IconsComponent} from './utilities/icons.component';
import {BlockViewer} from './blocks/blockviewer/blockviewer.component';
import {BlocksComponent} from './blocks/blocks/blocks.component';

import {CountryService} from './demo/service/countryservice';
import {CustomerService} from './demo/service/customerservice';
import {EventService} from './demo/service/eventservice';
import {IconService} from './demo/service/iconservice';
import {NodeService} from './demo/service/nodeservice';
import {PhotoService} from './demo/service/photoservice';
import {ProductService} from './demo/service/productservice';
import {ConfigService} from './demo/service/app.config.service';

import {MenuService} from './app.menu.service';
import {AppBreadcrumbService} from './app.breadcrumb.service';
import { TokenInterceptor } from './compartidos/interceptores/token.interceptor';
import { CompartidosModule } from './compartidos/compartidos.module';
import { PagesModule } from './pages/pages.module';
import { AppNotfoundComponent } from './pages/app.notfound.component';
import { AppErrorComponent } from './pages/app.error.component';
import { AppAccessdeniedComponent } from './pages/app.accessdenied.component';
import { Util } from './utilities/util';





@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        CompartidosModule,
        PagesModule,
        AppCodeModule
    ],
    declarations: [
        AppComponent,
        AppMainComponent,
        AppConfigComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppRightPanelComponent,
        AppBreadcrumbComponent,
        AppTopBarComponent,
        AppFooterComponent,
        IconsComponent,
        AppNotfoundComponent,
        AppErrorComponent,
        AppAccessdeniedComponent,
        BlocksComponent,
        BlockViewer,
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService, MenuService, AppBreadcrumbService, ConfigService,
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        Util,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
