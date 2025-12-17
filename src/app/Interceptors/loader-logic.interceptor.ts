import { HttpInterceptorFn } from '@angular/common/http';
import { APIconnectionService } from '../Services/apiconnection.service';
import { finalize } from 'rxjs';
import { inject } from '@angular/core';

export const loaderLogicInterceptor: HttpInterceptorFn = (req, next) => {

  let spinner = inject(APIconnectionService)
  
  spinner.startLoading()
  
  return next(req).pipe( 
    finalize( () => {
      spinner.stopLoading()    
    } )
  );
};
