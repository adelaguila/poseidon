export interface SortBy{
  columna: string,
  tipo: string
}

export interface Filter{
  columna: string,
  valor: string
}

export interface Meta {
  itemsPerPage: number,
  totalItems: number,
  currentPage: number,
  totalPages: number,
  sortBy: SortBy[],
  search: string,
  filter: Filter
}

export interface Links {
  first: string,
  previous: string,
  current: string,
  next: string,
  last: string
}
