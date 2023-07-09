import { FilterChildModel } from "./filter-child-model";
import { FilterModel } from "./filter-model";

export class Util {
    constructor() {}

    serialize(obj: any) {
        var p = [];
        for (var key in obj) {
            if (encodeURIComponent(obj[key]) == "null") {
                //console.log("null");
            } else {
                p.push(key + "=" + encodeURIComponent(obj[key]));
            }
        }
        return p.join("&");
    }

    MaterialJsonFilter(
        filter: FilterModel,
        value: any,
        field: string,
        matchMode: string
    ) {
        if (value.length == 0) value = null;

        if (value) {
            filter.logic = "and";
            let flagExiste: Boolean = false;

            for (let index = 0; index < filter.filters.length; index++) {
                const element = filter.filters[index];
                if (element.field == field) {
                    filter.filters[index].field = field;
                    filter.filters[index].operator = matchMode;
                    filter.filters[index].value = value;
                    flagExiste = true;
                }
            }

            if (!flagExiste)
                filter.filters.push({
                    field: field,
                    operator: matchMode,
                    value: value,
                });
        } else {
            for (let index = 0; index < filter.filters.length; index++) {
                const element = filter.filters[index];
                if (element.field == field) {
                    filter.filters.splice(index, 1);
                }
            }
        }

        return filter;
    }

    NestJsonFilter(filters: any) {
        let arrayFiltro: string[] = [];
        for (let [field, filter] of Object.entries(filters)) {

            let filtros = Object.values(filter);

            if (filtros[0] != null) {
                let match = this.changeOperador(filtros[1]);
                arrayFiltro.push(`filter.${field}=${match}:${filtros[0]}`);
            }
        }
        return arrayFiltro.join("&");
    }

    changeOperador(operador: string) {
        let oper = "";
        switch (operador) {
            case "startsWith":
                oper = "$sw";
                break;
            case "contains":
                oper = "$ilike";
                break;
            case "notContains":
                oper = "$not:$ilike";
                break;
            case "endsWith":
                oper = "$ilike";
                break;
            case "equals":
                oper = "$eq";
                break;
            case "notEquals":
                oper = "$not:$eq";
                break;
            case "in":
                oper = "$in";
                break;
            case "between":
                oper = "$btw";
                break;
            case "lt":
                oper = "$lt";
                break;
            case "lte":
                oper = "$lte";
                break;
            case "gt":
                oper = "$gt";
                break;
            case "gte":
                oper = "$gte";
                break;
            case "is":
                oper = "$is";
                break;
            case "isNot":
                oper = "$not:$is";
                break;
            case "before":
                oper = "";
                break;
            case "after":
                oper = "";
                break;
            case "dateIs":
                oper = "";
                break;
            case "dateIsNot":
                oper = "";
                break;
            case "dateBefore":
                oper = "";
                break;
            case "dateAfter":
                oper = "";
                break;
            default:
                oper = "";
        }

        return oper;
    }
}
