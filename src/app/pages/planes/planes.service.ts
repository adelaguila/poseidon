import { Injectable } from '@angular/core';
import { PlanInterface } from './plan.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/compartidos/servicios/token.service';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Links, Meta } from 'src/app/interfaces';
import { environment } from 'src/environments/environment';
import { checkToken } from 'src/app/compartidos/interceptores/token.interceptor';

const api_url = environment.api_url;

@Injectable({
  providedIn: 'root'
})
export class PlanesService {

    public plan!: PlanInterface;

    constructor(
        private http: HttpClient,
    ) {}

    getPlanes(
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
            .get<{ data: PlanInterface[]; meta: Meta; links: Links }>(
                `${api_url}/planes?${filtros}`,
                { context: checkToken(), params }
            )
            .pipe(
                map((response) => {
                    let planes = response.data as PlanInterface[];
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

    getPlanesSelect(){
        return this.http.get(`${api_url}/planes/lista`, {
            context: checkToken(),
        });
    }

    createPlan(plan: PlanInterface) {
        return this.http.post(`${api_url}/planes`, plan, {
            context: checkToken(),
        });
    }

    updatePlan(plan: PlanInterface) {
        return this.http.patch(`${api_url}/planes/${plan.id}`, plan, {
            context: checkToken(),
        });
    }

    deletePlan(id: number) {
        return this.http.delete(`${api_url}/planes/${id}`, {
            context: checkToken(),
        });
    }
}
