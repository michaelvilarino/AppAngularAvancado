import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";  
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuLoginComponent } from './menu-login/menu-login.component';
import { AcessoNegadoComponent } from './acesso-negado/acesso-negado.component';

@NgModule({
    declarations: [
        FooterComponent,
        HomeComponent,
        MenuComponent,
        NotFoundComponent,
        MenuLoginComponent,
        AcessoNegadoComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        NgbModule
    ],
    exports:[
        FooterComponent,
        HomeComponent,
        MenuComponent,
        NotFoundComponent,
        MenuLoginComponent,
        AcessoNegadoComponent
    ]
})

export class NavegacaoModule{ }