import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { BaseService } from 'src/app/services/base.service';
import { Produto, Fornecedor } from '../models/produto';

@Injectable()
export class ProdutoService extends BaseService {

    constructor(private http: HttpClient) { super() }

    obterTodos(): Observable<Produto[]> {
        return this.http
            .get<Produto[]>(this.UrlServiceV1 + "produtos", super.ObterAuthHeaderJson())
            .pipe(catchError(super.ServiceError));
    }

    obterPorId(id: string): Observable<Produto> {
        return this.http
            .get<Produto>(this.UrlServiceV1 + "produtos/ObterPorId/" + id, super.ObterAuthHeaderJson())
            .pipe(catchError(super.ServiceError));
    }

    novoProduto(produto: Produto): Observable<Produto> {
        return this.http
            .post(this.UrlServiceV1 + "produtos", produto, super.ObterAuthHeaderJson())
            .pipe(
                map(super.ExtractData),
                catchError(super.ServiceError));
    }

    atualizarProduto(produto: Produto): Observable<Produto> {
        return this.http
            .put(this.UrlServiceV1 + "produtos/" + produto.id, produto, super.ObterAuthHeaderJson())
            .pipe(
                map(super.ExtractData),
                catchError(super.ServiceError));
    }

    excluirProduto(id: string): Observable<Produto> {
        return this.http
            .delete(this.UrlServiceV1 + "produtos/excluir/" + id, super.ObterAuthHeaderJson())
            .pipe(
                map(super.ExtractData),
                catchError(super.ServiceError));
    }    

    obterFornecedores(): Observable<Fornecedor[]> {
        return this.http
            .get<Fornecedor[]>(this.UrlServiceV1 + "fornecedores/ObterTodos/")
            .pipe(catchError(super.ServiceError));
    }
}
