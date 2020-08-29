import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Fornecedor } from '../models/fornecedor';
import { CepConsulta } from '../models/endereco';

@Injectable()
export class FornecedorService extends BaseService {

    fornecedor: Fornecedor = new Fornecedor();

    constructor(private http: HttpClient) { super() 
    
        this.fornecedor.nome = "Teste Fake"
        this.fornecedor.documento = "32165498754"
        this.fornecedor.ativo = true
        this.fornecedor.tipoFornecedor = 1
    }

    obterTodos(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores/ObterTodos")
            .pipe(catchError(this.ServiceError));
    }

    obterPorId(id: string): Observable<Fornecedor> {
        return this.http
            .get<Fornecedor>(this.UrlServiceV1 + "fornecedores/ObterPorId/" + id, this.ObterAuthHeaderJson())
            .pipe(catchError(this.ServiceError));
    }

    novoFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
        return this.http
            .post(this.UrlServiceV1 + "fornecedores", fornecedor, this.ObterAuthHeaderJson())
            .pipe(
                map(this.ExtractData),
                catchError(this.ServiceError));
    }

    atualizarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
        return this.http
            .put(this.UrlServiceV1 + "fornecedores/Atualizar/" + fornecedor.id, fornecedor, this.ObterAuthHeaderJson())
            .pipe(
                map(this.ExtractData),
                catchError(this.ServiceError));
    }

    excluirFornecedor(id: string): Observable<Fornecedor> {
        return this.http
            .delete(this.UrlServiceV1 + "fornecedores/Excluir/" + id, this.ObterAuthHeaderJson())
            .pipe(
                map(this.ExtractData),
                catchError(this.ServiceError));
    }

    // atualizarEndereco(endereco: Endereco): Observable<Endereco> {
    //     return this.http
    //         .put(this.UrlServiceV1 + "fornecedores/endereco/" + endereco.id, endereco, this.ObterAuthHeaderJson())
    //         .pipe(
    //             map(this.ExtractData),
    //             catchError(this.ServiceError));
    // }

    consultarCep(cep: string): Observable<CepConsulta> {
        return this.http
            .get<CepConsulta>(`https://viacep.com.br/ws/${cep}/json/`)
            .pipe(catchError(this.ServiceError))
    }
}
