import { Injectable } from "@angular/core";
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { NovoComponent } from '../novo/novo.component';
import { LocalStorageUtils } from 'src/app/utils/localStorage';


@Injectable()
export class FornecedorGuard implements CanDeactivate<NovoComponent>, CanActivate{
    
    localStorageUtils = new LocalStorageUtils();

    constructor(private router: Router){}

    canActivate(routeAc: ActivatedRouteSnapshot, state: RouterStateSnapshot){

        if(!this.localStorageUtils.obterTokenUsuario()){
            this.router.navigate(['/conta/login']);
        }

        let user = this.localStorageUtils.obterUsuario();
        let claim: any = routeAc.data[0];

        if(claim !== undefined){
            let claim = routeAc.data[0]['claim'];

            if(claim){
                if(!user.claims){
                    this.navegarAcessoNegado();
                }

                let userClaims = user.claims.find(f => f.type == claim.nome);

                if(!userClaims){
                    this.navegarAcessoNegado();
                }

                let valoresClaim = userClaims.value  as string;

                if(!valoresClaim.includes(claim.valor)){
                    this.navegarAcessoNegado();
                }
            }
        }

        return true;
    }

    navegarAcessoNegado(){
        this.router.navigate(['/acesso-negado']);
    }

    canDeactivate(component: NovoComponent) {
        if(component.mudancasNaoSalvas){
            return window.confirm("As modificações não foram salvas, deseja sair?")
        }
    }


}