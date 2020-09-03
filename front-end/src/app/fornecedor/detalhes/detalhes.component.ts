import { Component } from '@angular/core';
import { Fornecedor } from '../models/fornecedor';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.component.html'
})
export class DetalhesComponent {

  fornecedor: Fornecedor = new Fornecedor();
  enderecoMap;

  constructor(
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer// O angular não deixa incorporar urls externas, isso é usado para abrir a brecha para a url informada no parâmetro
             ) 
  {

      this.fornecedor = this.route.snapshot.data['fornecedor'];
      this.enderecoMap = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?q="+this.ObterEnderecoCompleto() + "&key=AIzaSyBpYqHMG3UhU-6MH45Q56q-yUQ0a-NypIY");
  }

  public ObterEnderecoCompleto():string {      
      return "Avenida Monte Celeste, 503";
  }
}
