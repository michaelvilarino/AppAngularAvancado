import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormControlName } from '@angular/forms';
import { Usuario } from '../models/Usuario';
import { ContaService } from '../services/conta.service';
import { ValidationMessages, GenericValidator, DisplayMessage } from 'src/app/utils/generic-form-validation';
import { CustomValidators } from 'ngx-custom-validators';
import { Observable, fromEvent, merge } from 'rxjs';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { MessageHelper } from 'src/app/utils/generic-messages';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  cadastroForm: FormGroup;
  usuario: Usuario;

  errors: any[] = [];
  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};
  messageHelper:  MessageHelper;

  constructor(private fb: FormBuilder,
              private contaService: ContaService,
              private router: Router,
              private toastr: ToastrService
             ) { 

              this.messageHelper = new MessageHelper(toastr);

              this.validationMessages = {                
                email:{
                  required: 'Informe o e-mail',
                  email: 'E-mail inválido'
                },
                password:{
                  required: 'Informe a senha',
                  rangeLength: 'A senha deve possuir entre 6 e 15 caracteres'
                },
                confirmPassword:{
                 required: 'Informe a senha novamente',
                 rangeLength: 'A senha deve possuir entre 6 e 15 caracteres',
                 equalTo: 'As senhas não conferem'
               }
             };

             this.genericValidator = new GenericValidator(this.validationMessages);

             }

  ngOnInit(): void {

    let password = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15])]);
    let confirmPassword = new FormControl('', [Validators.required, CustomValidators.rangeLength([6,15]), CustomValidators.equalTo(password)])

    this.cadastroForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: password,
      confirmPassword: confirmPassword
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
                                               .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

     merge(...controlBlurs).subscribe(() => {
        this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);        
     });
  }

  adicionarConta():void{
     if(this.cadastroForm.dirty && this.cadastroForm.valid){
        this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value)
        
        this.contaService.registrarUsuario(this.usuario)
                         .subscribe(
                             sucesso => {this.processarSucesso(sucesso)},
                             falha => {this.processarFalha(falha)}
                         );
     }
  }

  processarSucesso(response: any){
       this.cadastroForm.reset();
       this.errors = [];

       this.contaService.localStorage.salvarDadosLocaisUsuario(response);
       this.messageHelper.msgSucesso('Cadastrado com sucesso', 'Sucesso', () => {
        this.router.navigate(['/home']);
       });
       
  }

  processarFalha(fail: any){
     this.errors = fail.error.erros;
     this.messageHelper.msgErro("Ocorreu um erro", "Erro");
  }

}
