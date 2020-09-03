import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { FornecedorService } from '../services/fornecedor.service';

import {utilsBr} from 'js-brasil';
import { NgBrazilValidators } from 'ng-brazil';
import { CepConsulta } from '../models/endereco';
import { StringUtils } from 'src/app/utils/stringUtils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-novo',
  templateUrl: './novo.component.html'
})
export class NovoComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = [];
  fornecedorForm: FormGroup;
  fornecedor: Fornecedor = new Fornecedor();

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};

  MASKS = utilsBr.MASKS;

  formResult: string = '';

  textoDocumento = "Cpf requerido";

  mudancasNaoSalvas: boolean;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {

    this.validationMessages = {
      nome: {
        required: 'Informe o Nome',
      },
      documento: {
        required: 'Informe o Documento',
        cpf: 'Cpf no formato inválido',
        cnpj: 'Cnpj no formato inválido'
      },
      descricao: {
        required: 'Informe o Logradouro'        
      },
      numero: {
        required: 'Informe o Número',
      },
      bairro: {
        required: 'Informe o Bairro',
      },
      cep: {
        required: 'Informe o CEP',
        cep: 'Cep no formato inválido'
      },
      cidade: {
        required: 'Informe a Cidade',
      },
      estado: {
        required: 'Informe o Estado',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    this.fornecedorForm = this.fb.group({
      nome: ['', [Validators.required]],
      documento: ['', [Validators.required, NgBrazilValidators.cpf]],
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]],
      
      endereco: this.fb.group({
        descricao: ['', [Validators.required]],
        numero: ['', [Validators.required]],
        complemento: [''],
        bairro: ['', [Validators.required]],
        cep: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        estado: ['', [Validators.required]]
      })
    });

    //Seta um valor default para os campos do formulário
    this.fornecedorForm.patchValue({ 
                                     tipoFornecedor : '1', 
                                     ativo: true
                                  });
  }

  ngAfterViewInit(): void {

    this.tipoFornecedorForm().valueChanges.subscribe(() => {

      this.trocarValidacaoDocumento();
      this.configurarElementosValidacao();
      this.validarFormulario();
    })

    this.configurarElementosValidacao();
  }

  configurarElementosValidacao(){
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

      merge(...controlBlurs).subscribe(()=>{
        this.validarFormulario();
      })
  }

  validarFormulario(){
    this.displayMessage = this.genericValidator.processarMensagens(this.fornecedorForm);
    this.mudancasNaoSalvas = true;
  }

  trocarValidacaoDocumento(){
    if(this.tipoFornecedorForm().value === "1"){
       this.documento().clearValidators();
       this.documento().setValidators([Validators.required, NgBrazilValidators.cpf]);
       this.textoDocumento = "Cpf requerido";
    }
    else{
      this.documento().clearValidators();
      this.documento().setValidators([Validators.required, NgBrazilValidators.cnpj]);
      this.textoDocumento = "Cnpj requerido";
    }    
  }

  tipoFornecedorForm(): AbstractControl{
      return this.fornecedorForm.get('tipoFornecedor');
  }

  documento(): AbstractControl{
    return this.fornecedorForm.get('documento');
  }

  buscarCep(cep:string){
   
      cep = StringUtils.somenteNumeros(cep);

      if(cep.length < 8 ) return;

      this.fornecedorService.consultarCep(cep)
          .subscribe(
              cepRetorno => this.preencherEnderecoConsulta(cepRetorno),
              erro => this.errors.push(erro)
          );
  }

  preencherEnderecoConsulta(cepConsulta: CepConsulta){
       this.fornecedorForm.patchValue({

        endereco:{
           descricao: cepConsulta.logradouro,
           bairro: cepConsulta.bairro,
           cep: cepConsulta.cep,
           cidade: cepConsulta.localidade,
           estado: cepConsulta.uf
        }

       });
  }

   adicionarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.spinner.show();

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);
      this.formResult = JSON.stringify(this.fornecedor);

      this.fornecedor.endereco.cep = StringUtils.somenteNumeros(this.fornecedor.endereco.cep);
      this.fornecedor.documento = StringUtils.somenteNumeros(this.fornecedor.documento);

      this.fornecedorService.novoFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );
        
        setTimeout(() => {      
          this.spinner.hide();
        }, 3000);
    }
  }

  processarSucesso(response: any) {
    this.fornecedorForm.reset();
    this.errors = [];

    this.mudancasNaoSalvas = false;

    let toast = this.toastr.success('Fornecedor cadastrado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    this.errors = fail.error.erros;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }
}