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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChildren(FormControlName, {read: ElementRef}) formInputElements: ElementRef[];

  loginForm: FormGroup;
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
                }
             };

             this.genericValidator = new GenericValidator(this.validationMessages);

             }

  ngOnInit(): void {    

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.rangeLength([6,15])]]
    });
  }

  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
                                               .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

     merge(...controlBlurs).subscribe(() => {
        this.displayMessage = this.genericValidator.processarMensagens(this.loginForm);               
     });
  }

  login():void{
     if(this.loginForm.dirty && this.loginForm.valid){
        this.usuario = Object.assign({}, this.usuario, this.loginForm.value)
        
        this.contaService.login(this.usuario)
                         .subscribe(
                             sucesso => {this.processarSucesso(sucesso)},
                             falha => {this.processarFalha(falha)}
                         );
                            
     }
  }

  processarSucesso(response: any){
       this.loginForm.reset();
       this.errors = [];

       this.contaService.localStorage.salvarDadosLocaisUsuario(response);
       this.messageHelper.msgSucesso('Logado com sucesso', 'Bem vindo(a)', () => {
         this.router.navigate(['/home']);
       });
       
  }

  processarFalha(fail: any){
     this.errors = fail.error.erros;
     this.messageHelper.msgErro("Ocorreu um erro", "Erro");
  }

}
