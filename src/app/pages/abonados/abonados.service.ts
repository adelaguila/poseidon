import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AbonadoInterface } from './abonado.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';

const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class AbonadosService {

    public abonado!: AbonadoInterface;

    constructor(private http: HttpClient) {}

    getAbonados(
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
            .get<{ data: AbonadoInterface[]; meta: Meta; links: Links }>(
                `${api_url}/abonados?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let abonados = response.data as AbonadoInterface[];
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

    createAbonado(abonado: AbonadoInterface) {
        return this.http.post(`${api_url}/abonado`, abonado, {
            context: checkToken(),
        });
    }

    updateAbonado(abonado: AbonadoInterface) {
        return this.http.patch(`${api_url}/abonados/${abonado.id}`, abonado, {
            context: checkToken(),
        });
    }

    deleteAbonado(id: number) {
        return this.http.delete(`${api_url}/abonados/${id}`, {
            context: checkToken(),
        });
    }

    autocompleteAbonado(term: string): Observable<AbonadoInterface[]> {
        return this.http
            .get<AbonadoInterface[]>(
                `${api_url}/abonado/autocomplete/${term}`,
                {
                    context: checkToken(),
                }
            )
            .pipe(
                catchError((e) => {
                    console.error(e.error.mensaje);
                    return throwError(e);
                })
            );
    }

    getAbonado(id: number): Observable<AbonadoInterface> {
        return this.http.get<AbonadoInterface>(`${api_url}/abonados/${id}`, {
            context: checkToken(),
        });
    }
}
