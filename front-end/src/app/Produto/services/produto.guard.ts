import { Injectable } from '@angular/core';
import { CanDeactivate, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { NovoComponent } from '../novo/novo.component';
import { LocalStorageUtils } from 'src/app/utils/localStorage';
import { BaseGuard } from 'src/app/services/base.guard';

@Injectable()
export class ProdutoGuard extends BaseGuard implements CanActivate, CanDeactivate<NovoComponent> {        

    constructor(protected router: Router){ super(router); }

    canDeactivate(component: NovoComponent) {
        if(component.mudancasNaoSalvas) {
            return window.confirm('Tem certeza que deseja abandonar o preenchimento do formulario?');
        }        
        return true;
    }

    canActivate(routeAc: ActivatedRouteSnapshot){
        return super.validarClaims(routeAc);
    }
}