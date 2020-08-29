import { Fornecedor } from './fornecedor';

export class Produto{
    id: string;
    descricao: string;
    imagemUpload: string;
    imagem: string;
    valor: number;
    dataCadastro: Date;
    Fornecedor: Fornecedor
}