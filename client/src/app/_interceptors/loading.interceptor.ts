import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { BusyService } from '../_services/busy.service';
export const InterceptorSkipHeader = 'X-Skip-Interceptor';
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: BusyService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.headers.has('IgnoreInterceptor')) {

      const newHeaders = request.headers.delete('IgnoreInterceptor');
      request = request.clone({ headers: newHeaders });


      return next.handle(request);
    }

    this.totalRequests++;
    this.loadingService.setLoading(true);

    return next.handle(request).pipe(
      delay(400),
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
