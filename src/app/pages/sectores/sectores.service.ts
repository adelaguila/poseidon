import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SectorInterface } from './sector.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';

const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class SectoresService {

    public sector!: SectorInterface;

    constructor(
        private http: HttpClient,
    ) {}

    getSectores(
        page?: number,
        rows?: number,
        sortfield?: string,
        sortorder?: string,
        filtros?: any
    ): Observable<any> {
        const params = new HttpParams()
            .set("page", page)
            .set("limit", rows)
            .set("sortBy", `${sortfield}:${sortorder.toUpperCase()}`);

        return this.http
            .get<{ data: SectorInterface[]; meta: Meta; links: Links }>(
                `${api_url}/sectores?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let sectores = response.data as SectorInterface[];
                    return {
                        data: response.data,
                        meta: response.meta,
                        links: response.links,
                    };
                }),
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }

    getSectoresSelect(){
        return this.http.get(`${api_url}/sectores/lista`, {
            context: checkToken(),
        });
    }

    createSector(sector: SectorInterface) {
        return this.http.post(`${api_url}/sectores`, sector, {
            context: checkToken(),
        });
    }

    updateSector(sector: SectorInterface) {
        return this.http.patch(`${api_url}/sectores/${sector.id}`, sector, {
            context: checkToken(),
        });
    }

    deleteSector(id: number) {
        return this.http.delete(`${api_url}/sectores/${id}`, {
            context: checkToken(),
        });
    }
}
