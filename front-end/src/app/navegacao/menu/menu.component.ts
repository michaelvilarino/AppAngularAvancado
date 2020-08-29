import { Component } from '@angular/core';


@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html'
})

export class MenuComponent { 

    public isCollapsed: Boolean;

    mostrarFornecedor:boolean = true;

    constructor(){
        this.isCollapsed = true;
    }
}