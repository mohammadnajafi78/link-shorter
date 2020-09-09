import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MyHttpInterceptor implements HttpInterceptor {
  public BASE_URL: string = environment.url;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.startsWith('http')) {
      const token = localStorage.getItem('token');
      let request = req.clone({url: this.BASE_URL + req.url});

      if (token) {
        request = request.clone({
          headers: req.headers.append('authorization', `Bearer ${token}`),
        });
      }
      return next.handle(request);
    } else {
      return next.handle(req);
    }
  }
}
