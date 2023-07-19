import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ViaInterface } from './via.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';


const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class ViasService {

    public via!: ViaInterface;

    constructor(
        private http: HttpClient,
    ) {}

    getVias(
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
            .get<{ data: ViaInterface[]; meta: Meta; links: Links }>(
                `${api_url}/vias?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let vias = response.data as ViaInterface[];
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

    getViasSelect(){
        return this.http.get(`${api_url}/vias/lista`, {
            context: checkToken(),
        });
    }


    createVia(via: ViaInterface) {
        return this.http.post(`${api_url}/vias`, via, {
            context: checkToken(),
        });
    }

    updateVia(via: ViaInterface) {
        return this.http.patch(`${api_url}/vias/${via.id}`, via, {
            context: checkToken(),
        });
    }

    deleteVia(id: number) {
        return this.http.delete(`${api_url}/vias/${id}`, {
            context: checkToken(),
        });
    }
}
