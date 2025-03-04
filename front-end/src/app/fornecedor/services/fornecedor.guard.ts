import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NovoComponent } from '../novo/novo.component';
import { LocalStorageUtils } from 'src/app/utils/localStorage';
import { BaseGuard } from 'src/app/services/base.guard';


@Injectable()
export class FornecedorGuard extends BaseGuard implements CanDeactivate<NovoComponent>, CanActivate{        

    constructor(protected router: Router){super(router)}

    canDeactivate(component: NovoComponent) {
        if(component.mudancasNaoSalvas){
            return window.confirm("As modificações não foram salvas, deseja sair?")
        }

        return true;
    }

    canActivate(routeAc: ActivatedRouteSnapshot){
        return super.validarClaims(routeAc);
    }
}