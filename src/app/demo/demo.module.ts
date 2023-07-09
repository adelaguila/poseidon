import { NgModule } from "@angular/core";

import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { DemoRoutingModule } from "./demo-routing.module";
import { DashboardDemoComponent } from "./view/dashboarddemo.component";
import { FormLayoutDemoComponent } from "./view/formlayoutdemo.component";
import { FloatLabelDemoComponent } from "./view/floatlabeldemo.component";
import { InvalidStateDemoComponent } from "./view/invalidstatedemo.component";
import { InputDemoComponent } from "./view/inputdemo.component";
import { ButtonDemoComponent } from "./view/buttondemo.component";
import { TableDemoComponent } from "./view/tabledemo.component";
import { ListDemoComponent } from "./view/listdemo.component";
import { TreeDemoComponent } from "./view/treedemo.component";
import { PanelsDemoComponent } from "./view/panelsdemo.component";
import { OverlaysDemoComponent } from "./view/overlaysdemo.component";
import { MediaDemoComponent } from "./view/mediademo.component";
import { MenusComponent } from "./view/menus/menus.component";
import { MessagesDemoComponent } from "./view/messagesdemo.component";
import { MiscDemoComponent } from "./view/miscdemo.component";
import { ChartsDemoComponent } from "./view/chartsdemo.component";
import { EmptyDemoComponent } from "./view/emptydemo.component";
import { FileDemoComponent } from "./view/filedemo.component";
import { DocumentationComponent } from "./view/documentation.component";
import { CompartidosModule } from "../compartidos/compartidos.module";
import { BrowserModule } from "@angular/platform-browser";
import { DemoComponent } from './demo.component';
import { AppCodeModule } from "../blocks/app-code/app.code.component";
import { CommonModule } from "@angular/common";


@NgModule({
    declarations: [
        DashboardDemoComponent,
        FormLayoutDemoComponent,
        FloatLabelDemoComponent,
        InvalidStateDemoComponent,
        InputDemoComponent,
        ButtonDemoComponent,
        TableDemoComponent,
        ListDemoComponent,
        TreeDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MediaDemoComponent,
        MenusComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        DocumentationComponent,
        DemoComponent,
    ],
    imports: [CommonModule, FormsModule, DemoRoutingModule, CompartidosModule, AppCodeModule],
})
export class DemoModule {}
