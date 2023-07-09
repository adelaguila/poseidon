import { FilterChildModel } from "./filter-child-model";

export class FilterModel {

    constructor(
        // public logic:string="and",
        public logic:string="&",
        public filters:FilterChildModel[]=[]
    ){

    }

}


