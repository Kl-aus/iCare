import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
const TOKEN_KEY = 'my-token';
const TOKEN_HEADER_KEY = 'Authorization';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  token: string;
  constructor() {
    this.getToken().then(r => this.token);
  }

  async getToken() {
    const accessToken = await Storage.get({key: TOKEN_KEY});
    this.token = accessToken.value;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('212.227.176.204')) {//TODO: dont forget to change
      console.log('backend request..'+ req.url);
      let authReq = req;
      this.getToken().then(r => this.token);
      if (this.token != null) {
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.token) });
      }
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
