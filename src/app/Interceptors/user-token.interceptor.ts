import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


export const userTokenInterceptor: HttpInterceptorFn = (req, next) => {
  let cookie =  inject(CookieService)
  const auth = req.clone( {
    headers: req.headers.set("Authorization", `Bearer ${cookie.get("userLogedIn")}`)
  } )
  return next(auth);
};
