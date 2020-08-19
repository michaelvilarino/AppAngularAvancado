import { ToastrService } from 'ngx-toastr';

export class MessageHelper {
   
constructor(private toastr: ToastrService) {}

   msgSucesso(mensagem:string, titulo: string, callBack = null):void {
       let toast = this.toastr.success(mensagem, titulo);

       if(toast){

           if(callBack && typeof callBack === "function"){
            toast.onHidden.subscribe(() => {
                callBack();
            })
           }           
       }
   }

   msgErro(mensagem:string, titulo:string, callBack = null){

    let toast = this.toastr.error(mensagem, titulo, callBack);

    if(toast){

        if(callBack && typeof callBack === "function"){
         toast.onHidden.subscribe(() => {
             callBack();
         })
        }           
    }   
   }

   msgAlerta(mensagem:string, titulo:string, callBack = null){

    let toast = this.toastr.warning(mensagem, titulo, callBack);

    if(toast){

        if(callBack && typeof callBack === "function"){
         toast.onHidden.subscribe(() => {
             callBack();
         })
        }           
    }   
   }

}