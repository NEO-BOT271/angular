import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const apiKey = environment.apiKey;

  let authReq = req.clone({
    setHeaders: {
      'X-API-KEY': apiKey
    }
  });

  if (token && token !== 'null' && token !== 'undefined') {
    authReq = authReq.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  return next(authReq);
};