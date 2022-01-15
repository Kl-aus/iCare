import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../service/authentication.service';
const TOKEN_KEY = 'my-token';
const TOKEN_HEADER_KEY = 'Authorization';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // token: string;

  constructor(private authService: AuthenticationService) {
    // this.getToken().then(r => this.token);
  }

  // async getToken() {
  //   const accessToken = await Storage.get({key: TOKEN_KEY});
  //   this.token = accessToken.value;
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('localhost')) {
      let authReq = req;
      if (this.authService.accessToken != null) {
        authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.authService.accessToken) });
      } else {
        console.log('Interceptor: token from auth service is null:' + this.authService.accessToken);
      }
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
