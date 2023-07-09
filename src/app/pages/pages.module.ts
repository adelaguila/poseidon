import { AppTopBarComponent } from "./../app.topbar.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
// import { AppRightPanelComponent } from "../app.rightpanel.component";
// import { AppMenuComponent } from "../app.menu.component";
// import { AppBreadcrumbComponent } from "../app.breadcrumb.component";
// import { AppFooterComponent } from "../app.footer.component";
// import { AppConfigComponent } from "../app.config.component";
import { CompartidosModule } from "../compartidos/compartidos.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppCrudComponent } from "./app.crud.component";
import { AppCalendarComponent } from "./app.calendar.component";
import { AppHelpComponent } from "./app.help.component";
import { AppTimelineDemoComponent } from "./app.timelinedemo.component";


@NgModule({
    declarations: [
        PagesComponent,
        AppCrudComponent,
        AppCalendarComponent,
        AppHelpComponent,
        AppTimelineDemoComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PagesRoutingModule,
        CompartidosModule,
    ],

})
export class PagesModule {}
