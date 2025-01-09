import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';
import { Tag, TagStats } from '../models/tag.models';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private apiUrl = `${environment.apiUrl}/tags`;

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getUserTags(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl).pipe(
      catchError((error) => {
        this.errorService.showError();
        return throwError(() => error);
      })
    );
  }
}
