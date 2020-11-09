import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProPublicaService {
  log: any;

  constructor(private http: HttpClient) {
  }

  getCongressMembers(): any {
    const headers = new HttpHeaders()
      .set('x-api-key', environment.congressMembers['x-api-key']);

    return this.http.get(environment.congressMembers.api, {headers})
      .pipe(
        catchError(this.handleError<any>('getCongressMembers', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T): any {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      // Let the app keep running by returning an empty result.
      return throwError(result as T);
    };
  }
}
