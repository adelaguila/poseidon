import { FilterMatchMode } from "primeng/api";

export const MATCHMODEOPTIONSTEXT = [
    { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
    { label: "Contiene", value: FilterMatchMode.CONTAINS },
    { label: "Es igual", value: FilterMatchMode.EQUALS },
];

export const MATCHMODEOPTIONSNUMBER = [
    { label: "Comienza con", value: FilterMatchMode.STARTS_WITH },
    { label: "Contiene", value: FilterMatchMode.CONTAINS },
    { label: "Es igual", value: FilterMatchMode.EQUALS },
    { label: "Menor que", value: FilterMatchMode.LESS_THAN },
    {
        label: "Menor o igual que",
        value: FilterMatchMode.LESS_THAN_OR_EQUAL_TO,
    },
    { label: "Mayor que", value: FilterMatchMode.GREATER_THAN },
    {
        label: "Mayor o igual que",
        value: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO,
    },
];
