import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/api.response.model';
import { SEEDS_API } from 'app/app.api';
import { AnaliseDto } from 'app/dtos/analiseDto.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class AnaliseService {
    constructor(private http: HttpClient) { }

    consultar(): Observable<AnaliseDto[]>{
        return this.http.get<Response>(`${SEEDS_API}/analyses`).pipe(
            map((resp) => resp.data));
    }

    detalhes(idAnalise:number): Observable<AnaliseDto>{
        return this.http.get<Response>(`${SEEDS_API}/analyses/${idAnalise}`).pipe(
            map((resp) => resp.data));
    }
    
}