import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { LocalStorageUtils } from '../utils/localStorage';
import { environment } from 'src/environments/environment';

export abstract class BaseService {

    public localStorage = new LocalStorageUtils();

    protected UrlServiceV1: string = environment.UrlServiceV1;

    protected ObterHeaderJson(){
      return {
          headers: new HttpHeaders({
              'Content-Type': 'application/json'
          })
      };

    }

    protected ExtractData(response: any){
       return response.data || {};
    }

    protected ServiceError(response: Response | any){
        let customError: string[] = [];

        if(response instanceof HttpErrorResponse){
            if(response.statusText ==="Unknown Error"){
                customError.push("Ocorreu um erro desconhecido");
                response.error.errors = customError;
            }
        }

        //console.error(response);
        return throwError(response);
    }
}