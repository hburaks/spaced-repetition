import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // SSL/TLS handshake sorunları için timeout süresini artır
    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Force HTTPS in production
    if (environment.production && !request.url.startsWith('https://')) {
      request = request.clone({
        url: request.url.replace('http://', 'https://'),
      });
    }

    return next.handle(request);
  }
} 