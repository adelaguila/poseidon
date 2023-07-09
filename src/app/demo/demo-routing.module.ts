import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./demo.component";
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
import { MessagesDemoComponent } from "./view/messagesdemo.component";
import { MiscDemoComponent } from "./view/miscdemo.component";
import { ChartsDemoComponent } from "./view/chartsdemo.component";
import { FileDemoComponent } from "./view/filedemo.component";
import { IconsComponent } from "../utilities/icons.component";
import { AppCrudComponent } from "../pages/app.crud.component";
import { AppCalendarComponent } from "../pages/app.calendar.component";
import { AppTimelineDemoComponent } from "../pages/app.timelinedemo.component";
import { AppInvoiceComponent } from "../pages/app.invoice.component";
import { AppHelpComponent } from "../pages/app.help.component";
import { EmptyDemoComponent } from "./view/emptydemo.component";
import { DocumentationComponent } from "./view/documentation.component";
import { BlocksComponent } from "../blocks/blocks/blocks.component";

const routes: Routes = [
    {
        path: "",
        component: DemoComponent,
        children: [
            { path: "", component: DashboardDemoComponent },
            { path: "uikit/formlayout", component: FormLayoutDemoComponent },
            { path: "uikit/floatlabel", component: FloatLabelDemoComponent },
            {
                path: "uikit/invalidstate",
                component: InvalidStateDemoComponent,
            },
            { path: "uikit/input", component: InputDemoComponent },
            { path: "uikit/button", component: ButtonDemoComponent },
            { path: "uikit/table", component: TableDemoComponent },
            { path: "uikit/list", component: ListDemoComponent },
            { path: "uikit/tree", component: TreeDemoComponent },
            { path: "uikit/panel", component: PanelsDemoComponent },
            { path: "uikit/overlay", component: OverlaysDemoComponent },
            {
                path: "uikit/menu",
                loadChildren: () =>
                    import("./view/menus/menus.module").then(
                        (m) => m.MenusModule
                    ),
            },
            { path: "uikit/media", component: MediaDemoComponent },
            { path: "uikit/message", component: MessagesDemoComponent },
            { path: "uikit/misc", component: MiscDemoComponent },
            { path: "uikit/charts", component: ChartsDemoComponent },
            { path: "uikit/file", component: FileDemoComponent },
            { path: "utilities/icons", component: IconsComponent },
            { path: "pages/crud", component: AppCrudComponent },
            { path: "pages/calendar", component: AppCalendarComponent },
            { path: "pages/timeline", component: AppTimelineDemoComponent },
            { path: "pages/invoice", component: AppInvoiceComponent },
            { path: "pages/help", component: AppHelpComponent },
            { path: "pages/empty", component: EmptyDemoComponent },
            { path: "documentation", component: DocumentationComponent },
            { path: "blocks", component: BlocksComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DemoRoutingModule {}
