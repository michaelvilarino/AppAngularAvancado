import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { ContaRoutingModule } from './conta.route';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContaAppComponent } from './conta.app.component';
import { ContaService } from './services/conta.service';
import { CustomFormsModule } from 'ngx-custom-validators';
import { ContaGuard } from './services/conta.guard';


@NgModule({
  declarations: [ContaAppComponent, CadastroComponent, LoginComponent],
  imports: [
    CommonModule, 
    RouterModule,
    ContaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CustomFormsModule
  ],
  providers: [ContaService, ContaGuard]
})
export class ContaModule { }
