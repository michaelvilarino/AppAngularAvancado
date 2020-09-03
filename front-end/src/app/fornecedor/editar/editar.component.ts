import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';

import { ToastrService } from 'ngx-toastr';

import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { Fornecedor } from '../models/fornecedor';
import { Endereco } from '../models/endereco';
import { FornecedorService } from '../services/fornecedor.service';
import { utilsBr } from 'js-brasil';
import { NgBrazilValidators } from 'ng-brazil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html'
})
export class EditarComponent implements OnInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  errors: any[] = [];
  errorsEndereco: any[] = [];
  fornecedorForm: FormGroup;
  enderecoForm: FormGroup;

  fornecedor: Fornecedor = new Fornecedor();
  endereco: Endereco = new Endereco();

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  textoDocumento: string = '';
  mask = utilsBr.MASKS;

  tipoFornecedor: number;
  formResult: string = '';

  mudancasNaoSalvas: boolean;

  constructor(private fb: FormBuilder,
    private fornecedorService: FornecedorService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private spinner: NgxSpinnerService ) {

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
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

    this.fornecedor = this.route.snapshot.data['fornecedor'];    
  }

  ngOnInit() {

    this.spinner.show();

    this.fornecedorForm = this.fb.group({
      id: '',
      nome: ['', [Validators.required]],
      documento: '',
      ativo: ['', [Validators.required]],
      tipoFornecedor: ['', [Validators.required]]
    });

    this.enderecoForm = this.fb.group({
      id: '',
      descricao: ['', [Validators.required]],
      fornecedorId: ''
    });   

    this.fornecedorForm.patchValue({
        id: this.fornecedor.id,
        tipoFornecedor : this.fornecedor.tipoFornecedor.toString(),
        ativo: this.fornecedor.ativo,
        nome: this.fornecedor.nome,
        documento: this.fornecedor.documento       
    });

    //Fecha o loading da tela
    setTimeout(() => {      
      this.spinner.hide();
    }, 3000);
  }

  ngAfterViewInit() {

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

  editarFornecedor() {
    if (this.fornecedorForm.dirty && this.fornecedorForm.valid) {

      this.fornecedor = Object.assign({}, this.fornecedor, this.fornecedorForm.value);

      console.log(JSON.stringify( this.fornecedor));

      this.fornecedorService.atualizarFornecedor(this.fornecedor)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso) },
          falha => { this.processarFalha(falha) }
        );

      this.mudancasNaoSalvas = false;
    }
  }

  processarSucesso(response: any) {
    this.errors = [];

    let toast = this.toastr.success('Fornecedor atualizado com sucesso!', 'Sucesso!');
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['/fornecedores/listar-todos']);
      });
    }
  }

  processarFalha(fail: any) {
    console.log(fail);
    this.errors = fail.error.erros;
    this.toastr.error('Ocorreu um erro!', 'Opa :(');
  }

  abrirModal(content){
    this.modalService.open(content);
  }
}
