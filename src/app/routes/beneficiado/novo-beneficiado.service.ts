import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/api.response.model';
import { SEEDS_API } from 'app/app.api';
import { AnaliseSendDto } from 'app/dtos/analiseSendDto.model';
import { BenefitedDto } from 'app/dtos/benefitedDto.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class BeneficiadoService {

    constructor(private http: HttpClient) { }

    getBeneficiados(): Observable<BenefitedDto[]>{
        return this.http.get<Response>(`${SEEDS_API}/benefiteds`).pipe(
            map((resp) => resp.data));
    }

    createBeneficiado(beneficiado: any) {
        return this.http.post<Response>(`${SEEDS_API}/benefiteds`, beneficiado).pipe(
            map((resp) => resp));
    }

    deletar(idbeneficiado:any){
        return this.http.delete<Response>(`${SEEDS_API}/benefiteds/${idbeneficiado}`).pipe(
            map((resp) => resp));
    }

    visualizarBeneficiado(idbeneficiado: any): Observable<BenefitedDto>{
        return this.http.get<Response>(`${SEEDS_API}/benefiteds/${idbeneficiado}`).pipe(
            map((resp) => resp.data));
    }

    editarBeneficiado(beneficiado: any, beneficiadoId: any){
        return this.http.put<Response>(`${SEEDS_API}/benefiteds/${beneficiadoId}`, beneficiado).pipe(
            map((resp) => resp.data));
    }
}