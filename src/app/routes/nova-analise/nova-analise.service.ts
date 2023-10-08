import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/api.response.model';
import { SEEDS_API } from 'app/app.api';
import { AnaliseSendDto } from 'app/dtos/analiseSendDto.model';
import { BenefitedDto } from 'app/dtos/benefitedDto.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class NovaAnaliseService {

    constructor(private http: HttpClient) { }

    getBeneficiados(): Observable<BenefitedDto[]>{
        return this.http.get<Response>(`${SEEDS_API}/benefiteds`).pipe(
            map((resp) => resp.data));
    }

    createAnalise(analise: AnaliseSendDto) {
        return this.http.post<Response>(`${SEEDS_API}/analyses`, analise).pipe(
            map((resp) => resp));
      }
}