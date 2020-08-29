import { Injectable } from "@angular/core";
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { CadastroComponent } from '../cadastro/cadastro.component';
import { LocalStorageUtils } from 'src/app/utils/localStorage';

@Injectable()
export class ContaGuard implements CanDeactivate<CadastroComponent>, CanActivate{


    constructor(private router: Router) {}

    localstorageUtils = new LocalStorageUtils();

    canDeactivate(component: CadastroComponent){
        
        if(component.mudancasNaoSalvas){
            return window.confirm("Informção não salvas, deseja abandonar o formulário?");
        }
        return true;
    }

    canActivate(){
        if(this.localstorageUtils.obterTokenUsuario())
        {
            this.router.navigate(['/home']);
        }

        return true;
    }

}