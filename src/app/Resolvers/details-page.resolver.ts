import { ResolveFn, Router } from '@angular/router';
import { Products } from '../Interfaces/products';
import { inject } from '@angular/core';
import { APIconnectionService } from '../Services/apiconnection.service';

export const detailsPageResolver: ResolveFn<Products> = (route, state) => {
  const _http = inject(APIconnectionService);
  
  return _http.goToDetailsPage(String(route.paramMap.get('productID')));
};
