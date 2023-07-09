interface AlineacionColumna {
  vertical?:
    | 'middle'
    | 'top'
    | 'bottom'
    | 'distributed'
    | 'justify'
    | undefined;
  horizontal?:
    | 'distributed'
    | 'justify'
    | 'fill'
    | 'left'
    | 'center'
    | 'right'
    | 'centerContinuous'
    | undefined;
}

interface CabeceraHoja{
  logo: boolean;
  titulo: string;
  subtitulo: string;
}
interface CabeceraColumna{
  titulo: string;
  alineacion: AlineacionColumna;
}

export interface HojaExcelInterface {
  nombre: string;
  cabeceraHoja?: CabeceraHoja;
  cabecerasColumnas: string[];
  anchoColumnas: number[];
  alineacionColumnas?: AlineacionColumna[];
  dataColumnas: any;
}

export interface ArchivoExcelInterface {
  nombre: string;
  hojas: HojaExcelInterface[];
}
