import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NovoComponent } from '../novo/novo.component';

@Injectable()
export class FornecedorGuard implements CanDeactivate<NovoComponent>, CanActivate{
    
    canActivate(){
        return true;
    }

    canDeactivate(component: NovoComponent) {
        return true;
    }


}