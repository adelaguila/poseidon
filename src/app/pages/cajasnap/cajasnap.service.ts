import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CajanapInterface } from './cajanap.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';

const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class CajasnapService {

    public caja!: CajanapInterface;

    constructor(
        private http: HttpClient,
    ) {}

    getCajasnap(
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
            .get<{ data: CajanapInterface[]; meta: Meta; links: Links }>(
                `${api_url}/cajanap?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let cajanap = response.data as CajanapInterface[];
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

    getCajasnapSelect(){
        return this.http.get(`${api_url}/cajanap/lista`, {
            context: checkToken(),
        });
    }

    createCajanap(caja: CajanapInterface) {
        return this.http.post(`${api_url}/cajanap`, caja, {
            context: checkToken(),
        });
    }

    updateCajanap(caja: CajanapInterface) {
        return this.http.patch(`${api_url}/cajanap/${caja.id}`, caja, {
            context: checkToken(),
        });
    }

    deleteCajanap(id: number) {
        return this.http.delete(`${api_url}/cajanap/${id}`, {
            context: checkToken(),
        });
    }

}
